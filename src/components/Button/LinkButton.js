import { Link } from 'react-router-dom';

function LinkButton({ linkText, href }) {
  return (
    <Link className="link-button" to={href}>
      {linkText}
    </Link>
  );
}

export default LinkButton;
