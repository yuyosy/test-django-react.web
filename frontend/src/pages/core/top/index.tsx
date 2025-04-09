interface Props {
  message: string;
}

const App = (props: Props) => {
  return (
    <div>
      <h1>Welcome to the Top Page!</h1>
      <h2>{props.message}</h2>
    </div>
  );
};

export default App;
