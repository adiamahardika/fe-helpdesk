import React, { Fragment, useRef, useState } from "react";
import IdleTimer from "react-idle-timer";
import { Modal } from "reactstrap";

const IdleTimerContainer = (props) => {
  const IdleTimerRef = useRef(null);
  const sessionTimeoutRef = useRef(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const onIdle = () => {
    setModalIsOpen(!modalIsOpen);
    sessionTimeoutRef.current = setTimeout(logOut, 150000);
  };
  const stayActive = () => {
    setModalIsOpen(!modalIsOpen);
    clearTimeout(sessionTimeoutRef.current);
  };
  const logOut = () => {
    setModalIsOpen(!modalIsOpen);
    window.location.assign("/login");
    clearTimeout(sessionTimeoutRef.current);
    sessionStorage.clear();
  };

  return (
    <Fragment>
      <Modal isOpen={modalIsOpen} centered={true}>
        <div
          className="modal-body"
          style={{ display: "grid", justifyItems: "center" }}
        >
          <h3>You've been idle for a while!</h3>
          <h5>You will be logged out soon</h5>
          <div
            style={{
              display: "grid",
              gridAutoFlow: "column",
              columnGap: "1rem",
            }}
          >
            <button
              type="button"
              onClick={logOut}
              className="btn btn-danger waves-effect"
            >
              Log me out
            </button>
            <button
              type="button"
              className="btn btn-primary waves-effect waves-light"
              onClick={stayActive}
            >
              Keep me signed in
            </button>
          </div>
        </div>
      </Modal>
      <IdleTimer ref={IdleTimerRef} timeout={1800 * 1000} onIdle={onIdle} />
    </Fragment>
  );
};
export default IdleTimerContainer;
