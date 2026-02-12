import { Component } from "react";

type Props = {};

type State = {};

class Footer extends Component<Props, State> {
  state = {};

  render() {
    return (
      <footer className="mt-6 text-slate-400 text-center">
        <small>© {new Date().getFullYear()} CrossPoint</small>
      </footer>
    );
  }
}

export default Footer;
