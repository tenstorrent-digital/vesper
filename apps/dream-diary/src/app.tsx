import { useMemo, useState } from "react";
import {
  Divider,
  KeyHint,
  Panel,
  Row,
  Stack,
  useInput,
  useTui,
} from "vesper-tui";

import { Button } from "@tenstorrent/vesper/button";
import { TextArea } from "@tenstorrent/vesper/text-area";
import { TextInput } from "@tenstorrent/vesper/text-input";
import { Typography } from "@tenstorrent/vesper/typography";

import { addDream, type Dream,loadDreams } from "./store.js";

type View = "browse" | "record";

export function DreamDiary() {
  const [dreams, setDreams] = useState(loadDreams);
  const [selectedId, setSelectedId] = useState<string | undefined>(
    dreams[0]?.id,
  );
  const [view, setView] = useState<View>("browse");
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [message, setMessage] = useState("");
  const { exit } = useTui();
  const selectedDream = useMemo(
    () => dreams.find((dream) => dream.id === selectedId) ?? dreams[0],
    [dreams, selectedId],
  );

  useInput((_input, key, event) => {
    if (view === "browse" && key.name === "n") {
      event.preventDefault();
      setMessage("");
      setView("record");
    }
    if (view === "browse" && key.name === "q") {
      event.preventDefault();
      exit();
    }
  });

  const saveDream = () => {
    if (!title.trim() || !notes.trim()) return;
    try {
      const nextDreams = addDream(dreams, { notes, title });
      setDreams(nextDreams);
      setSelectedId(nextDreams[0]?.id);
      setTitle("");
      setNotes("");
      setMessage("Dream saved.");
      setView("browse");
    } catch (error) {
      setMessage(
        error instanceof Error ? `Could not save: ${error.message}` : "Could not save.",
      );
    }
  };

  return (
    <Panel title="✦ Dream Diary">
      <Stack gap={1}>
        <Typography as="h1" variant="heading-xl">
          Capture the night. Revisit it later.
        </Typography>
        <Divider />
        {view === "record" ? (
          <Stack gap={1}>
            <Typography as="h2" variant="heading-md">
              Record a dream
            </Typography>
            <TextInput
              aria-label="Title"
              maxLength={80}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="A short title"
              value={title}
            />
            <TextArea
              aria-label="What happened?"
              maxLength={2_000}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Describe everything you remember…"
              value={notes}
            />
            <Row gap={2}>
              <Button
                disabled={!title.trim() || !notes.trim()}
                onClick={saveDream}
              >
                Save dream
              </Button>
              <Button variant="ghost" onClick={() => setView("browse")}>
                Cancel
              </Button>
            </Row>
          </Stack>
        ) : (
          <BrowseDreams
            dreams={dreams}
            onNew={() => {
              setMessage("");
              setView("record");
            }}
            onQuit={exit}
            onSelect={setSelectedId}
            selectedDream={selectedDream}
          />
        )}
        {message && (
          <Typography variant="copy-sm-bold">{message}</Typography>
        )}
        <Divider character="·" />
        <Row gap={2}>
          {view === "browse" && <KeyHint keyName="n" description="new dream" />}
          <KeyHint keyName="↑/↓ or Tab" description="navigate" />
          <KeyHint keyName="Enter" description="choose" />
          <KeyHint keyName="Esc" description="quit" />
        </Row>
      </Stack>
    </Panel>
  );
}

interface BrowseDreamsProps {
  dreams: Dream[];
  onNew(): void;
  onQuit(): void;
  onSelect(id: string): void;
  selectedDream?: Dream;
}

function BrowseDreams({
  dreams,
  onNew,
  onQuit,
  onSelect,
  selectedDream,
}: BrowseDreamsProps) {
  return (
    <Stack gap={1}>
      <Row gap={2}>
        <Button onClick={onNew}>Record a dream</Button>
        <Button variant="ghost" onClick={onQuit}>
          Quit
        </Button>
      </Row>
      {dreams.length === 0 ? (
        <Typography>
          No dreams recorded yet. Choose “Record a dream” to add one.
        </Typography>
      ) : (
        <Panel title={`Dreams (${dreams.length})`}>
          <Stack>
            {dreams.map((dream) => (
              <Button
                key={dream.id}
                onClick={() => onSelect(dream.id)}
                variant={dream.id === selectedDream?.id ? "primary" : "subtle"}
              >
                {formatDate(dream.createdAt)} · {dream.title}
              </Button>
            ))}
          </Stack>
        </Panel>
      )}
      {selectedDream && (
        <Panel title={selectedDream.title}>
          <Stack gap={1}>
            <Typography variant="label-sm-mono">
              {formatTimestamp(selectedDream.createdAt)}
            </Typography>
            <Typography>{selectedDream.notes}</Typography>
          </Stack>
        </Panel>
      )}
    </Stack>
  );
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    day: "2-digit",
    month: "short",
  }).format(new Date(value));
}

function formatTimestamp(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
