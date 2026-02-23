import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div>
      <h1>Home</h1>
      <p>
        <Link to="/register">Register</Link> or <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
