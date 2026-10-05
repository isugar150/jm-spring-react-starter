export default function Loading() {
  return (
    <div
      role="status"
      aria-busy="true"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        minHeight: 120,
      }}
    >
      <span
        style={{
          fontSize: 14,
          color: "#666",
        }}
      >
        로딩 중...
      </span>
    </div>
  );
}
