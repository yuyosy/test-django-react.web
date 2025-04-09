import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './header';
import Home from './home';
import SubPage1 from './sub1';

export interface Pathes {
  home: string;
  sub1: string;
}
const pathes: Pathes = {
  home: '/example/example2',
  sub1: '/example/example2/sub1',
};

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Header {...pathes} />
        <h1>Welcome to Example 2</h1>
        <Routes>
          <Route path={pathes.home} element={<Home />} />
          <Route path={pathes.sub1} element={<SubPage1 />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
