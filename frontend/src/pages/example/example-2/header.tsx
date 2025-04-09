import { Link } from 'react-router-dom';
import { Pathes } from '.';
import './header.css';

const Header = (props: Pathes) => {
  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link to={props.home}>Home</Link>
          </li>
          <li>
            <Link to={props.sub1}>Sub Page 1</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
