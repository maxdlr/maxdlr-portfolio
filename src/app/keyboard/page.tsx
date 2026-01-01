const KeyboardPage = () => {
  const currentVersionId = "latest";
  return (
    <div className="pt-[60%] relative rounded-2xl">
      <iframe
        src={`https://configure.zsa.io/embed/voyager/layouts/Qww9W/${currentVersionId}/0`}
        style={{
          border: 0,
          height: "100%",
          left: 0,
          position: "absolute",
          top: 0,
          width: "100%",
        }}
      />
    </div>
  );
};

export default KeyboardPage;
