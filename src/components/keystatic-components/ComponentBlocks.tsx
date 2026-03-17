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

const TldrBlock = wrapper({
  label: "TL;DR Block",
  description: "AEO 최적화: 글의 핵심 요약을 2~3문장으로 제공합니다. AI Featured Snippet 추출에 최적화됩니다.",
  ContentView: (props) => (
    <div
      style={{
        borderLeft: "4px solid #3b82f6",
        background: "#eff6ff",
        borderRadius: "8px",
        padding: "12px",
      }}
    >
      <div style={{ fontSize: "12px", color: "#3b82f6", fontWeight: "bold", marginBottom: "4px" }}>
        TL;DR
      </div>
      <div style={{ fontSize: "14px", color: "#1e293b" }}>{props.children}</div>
    </div>
  ),
  schema: {
    content: fields.child({
      kind: "block",
      formatting: { inlineMarks: "inherit", softBreaks: "inherit" },
      links: "inherit",
      editIn: "both",
      label: "TL;DR Content",
      placeholder: "글의 핵심 내용을 2~3문장으로 요약하세요",
    }),
  },
});

const KeyTakeaways = wrapper({
  label: "Key Takeaways",
  description: "AEO 최적화: 핵심 포인트를 불릿 리스트로 정리합니다.",
  ContentView: (props) => (
    <div
      style={{
        border: "1px solid #e2e8f0",
        background: "#f8fafc",
        borderRadius: "8px",
        padding: "12px",
      }}
    >
      <div style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "8px", color: "#1e293b" }}>
        Key Takeaways
      </div>
      <div style={{ fontSize: "13px", color: "#475569" }}>{props.children}</div>
    </div>
  ),
  schema: {
    content: fields.child({
      kind: "block",
      formatting: { inlineMarks: "inherit", softBreaks: "inherit", listTypes: "inherit" },
      links: "inherit",
      editIn: "both",
      label: "Key Takeaways Content",
      placeholder: "- 핵심 포인트 1\n- 핵심 포인트 2\n- 핵심 포인트 3",
    }),
  },
});

const CitationCapsule = wrapper({
  label: "Citation Capsule",
  description: "GEO 최적화: AI가 인용하기 좋은 Q&A 형태의 콘텐츠 블록입니다.",
  ContentView: (props) => (
    <div
      style={{
        borderLeft: "4px solid #6366f1",
        background: "#eef2ff",
        borderRadius: "8px",
        padding: "12px",
      }}
    >
      <div style={{ fontSize: "14px", fontWeight: "bold", color: "#4338ca", marginBottom: "4px" }}>
        Q: {props.value.question || "(질문을 입력하세요)"}
      </div>
      <div style={{ fontSize: "13px", color: "#475569" }}>{props.children}</div>
    </div>
  ),
  schema: {
    question: fields.text({
      label: "Question",
      description: "AI가 답변할 질문을 입력하세요. 예: 'GEO란 무엇인가?'",
    }),
    content: fields.child({
      kind: "block",
      formatting: { inlineMarks: "inherit", softBreaks: "inherit" },
      links: "inherit",
      editIn: "both",
      label: "Answer",
      placeholder: "질문에 대한 명확하고 간결한 답변을 작성하세요",
    }),
  },
});

export default {
  Admonition,
  HtmlBlock,
  TldrBlock,
  KeyTakeaways,
  CitationCapsule,
};
