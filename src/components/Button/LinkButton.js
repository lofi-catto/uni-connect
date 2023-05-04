import { Link } from 'react-router-dom';

function LinkButton({ children, href }) {
  return (
    <Link className="link-button" to={href}>
      {children}
    </Link>
  );
}

export default LinkButton;
