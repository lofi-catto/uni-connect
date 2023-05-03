import { Link } from 'react-router-dom';

function LinkButton({ linkText, href }) {
  return <Link to={href}>{linkText}</Link>;
}

export default LinkButton;
