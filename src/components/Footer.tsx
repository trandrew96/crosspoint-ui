import { Component } from "react";

type Props = {};

type State = {};

class Footer extends Component<Props, State> {
  state = {};

  render() {
    return (
      <footer className="mt-6 text-slate-400 text-center mb-5">
        <small>© {new Date().getFullYear()} CrossPoint</small>
        <br />
        <a
          href="https://www.flaticon.com/free-icons/game-console"
          title="game console icons"
        >
          Game console icons created by Hilmy Abiyyu A. - Flaticon
        </a>
      </footer>
    );
  }
}

export default Footer;
