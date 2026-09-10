# Pi

Shared configuration for [pi](https://github.com/earendil-works/pi/tree/main/packages/coding-agent)

## Settings

Here we set the default provider and model that will be set when Pi opens in this repository.

The default **provider** is currently configured to be Github Copilot, with access provided through Tenstorrent IT[^1].

The default **model** is arbitrary, but must be set in order to start Pi using our default provider (We can update the model here whenever we like).

### Provider Setup

> [!NOTE]
> 
> To use Github Copilot as a provider, you must have access to Github Copilot[^1].

Run `/login` from inside Pi, then select Github Copilot, and login with your Github account[^2].

If you don't have access to Github Copilot, or you have not authenticated with Github with `/login`, pi will fallback to your global settings.

## Skills

Agent skills are managed for all agents with the `agent:skills:*` commands in [package.json](https://github.com/tenstorrent-digital/vesper/blob/main/package.json). Adding a skill with `agent:skills:add` will automatically setup the skill for use in Pi.
