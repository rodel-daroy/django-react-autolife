import React, { Component } from "react";
import MainLinks from "./MainLinks";
import { connect } from "react-redux";
import SearchField from "./SearchField";
import SubscribeField from "./SubscribeField";

class Navbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      scrolled: false
    };
  }

  componentDidMount() {
    this.props.scrollContainer().addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    this.props
      .scrollContainer()
      .removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = () => {
    const { scrolling } = this.props;

    if (scrolling) {
      const currentScrolled = this.props.scrollContainer().scrollTop > 0;

      if (currentScrolled !== this.state.scrolled) {
        this.setState({
          scrolled: currentScrolled
        });
      }
    }
  };

  render() {
    const { scrolled } = this.state;
    let { animationRef } = this.props;
    animationRef = animationRef || (() => {});

    return (
      <div className="main-navbar-outer">
        <nav className="main-navbar-inner">
          {/*navigation */}
          <MainLinks animationRef={animationRef} user={this.props.user} />
          {/*navigation */}
          {/*right */}
          <div
            ref={ref => animationRef(ref, 20, 1)}
            className="main-navbar-right"
          >
            {/* <HeaderField animationRef={ref => animationRef(ref, 20, 1)} /> */}

            <SubscribeField collapse={scrolled} black={scrolled} showCaption />
            {/* <HeaderField animationRef={ref => animationRef(ref, 21)} /> */}

            <SearchField collapse black={scrolled} />
          </div>
          {/*right */}
        </nav>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  scrolling: state.layout.scrolling,
  user: state.user.authUser
});

export default connect(mapStateToProps)(Navbar);
