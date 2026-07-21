import Content, { frontmatter } from "./frontmatter-example.mdx";

export default function Page() {
  return (
    <section>
      <header>
        <h1>
          <code>frontmatter.title</code>: {frontmatter.title}
        </h1>
      </header>
      <Content />
    </section>
  );
}
