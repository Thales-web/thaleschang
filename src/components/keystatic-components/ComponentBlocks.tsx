import { fields } from "@keystatic/core";
import { block, wrapper } from "@keystatic/core/content-components";

// preview components
import KeystaticAdmonition from "./KeystaticAdmonition";

const Admonition = wrapper({
  label: "Admonition",
  ContentView: (props) => (
    <KeystaticAdmonition variant={props.value.variant}>{props.children}</KeystaticAdmonition>
  ),
  schema: {
    variant: fields.select({
      label: "Variant",
      options: [
        { value: "info", label: "Info" },
        { value: "tip", label: "Tip" },
        { value: "caution", label: "Caution" },
        { value: "danger", label: "Danger" },
      ],
      defaultValue: "info",
    }),
    // This makes it so you can edit what is inside the admonition
    content: fields.child({
      kind: "block",
      formatting: { inlineMarks: "inherit", softBreaks: "inherit" },
      links: "inherit",
      editIn: "both",
      label: "Admonition Content",
      placeholder: "Enter your admonition content here",
    }),
  },
});

const HtmlBlock = block({
  label: "HTML Block",
  description: "HTML 코드를 직접 붙여넣을 수 있습니다. 외부 도구에서 생성한 멀티미디어 콘텐츠에 사용하세요.",
  ContentView: (props) => (
    <div
      style={{
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        padding: "12px",
        background: "#f8fafc",
      }}
    >
      <div
        style={{
          fontSize: "12px",
          color: "#64748b",
          marginBottom: "8px",
          fontWeight: "bold",
        }}
      >
        📄 HTML Block
      </div>
      <pre
        style={{
          fontSize: "12px",
          color: "#334155",
          whiteSpace: "pre-wrap",
          wordBreak: "break-all",
          maxHeight: "200px",
          overflow: "auto",
        }}
      >
        {props.value.html || "(HTML 코드를 입력하세요)"}
      </pre>
    </div>
  ),
  schema: {
    html: fields.text({
      label: "HTML Code",
      description: "HTML 코드를 붙여넣으세요. iframe, img, div 등 모든 HTML 태그를 사용할 수 있습니다.",
      multiline: true,
    }),
  },
});

export default {
  Admonition,
  HtmlBlock,
};
