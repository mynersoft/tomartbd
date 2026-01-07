function layout({ children }) {
  return (
    <div className="flex">
      <div>Sidebar</div>
      <div>{children}</div>
    </div>
  );
}

export default layout;
