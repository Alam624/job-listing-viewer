import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Form, Stack } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import moment from "moment";

export default function JobListings() {
  const [listings, setListings] = useState([]);
  const [currentListing, setCurrentListing] = useState({});
  const [noteIndex, setNoteIndex] = useState(-1);
  const [newNote, setNewNote] = useState("");
  const [sortValue, setSortValue] = useState("");
  const [filterValue, setFilterValue] = useState("");

  const [show, setShow] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showStatus, setShowStatus] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleCloseEdit = () => setShowEdit(false);
  const handleShowEdit = () => setShowEdit(true);
  const handleCloseStatus = () => setShowStatus(false);
  const handleShowStatus = () => setShowStatus(true);

  useEffect(() => {
    axios
      .get(`https://job-listing-viewer.herokuapp.com/listings/?sort=${sortValue}&status=${filterValue}`)
      .then((res) => {
        console.log(res);
        setListings(res.data);
      })
      .catch((err) => console.log(err));
  }, [filterValue, sortValue]);

  const handleSaveNewNote = () => {
    var tempListing = currentListing;
    tempListing.notes.push(newNote);
    setCurrentListing(tempListing);
    console.log(currentListing.notes);
    axios
      .put(`https://job-listing-viewer.herokuapp.com/update/${currentListing._id}`, currentListing)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
    setShow(false);
  };

  const handleEditNote = () => {
    var tempListing = currentListing;
    tempListing.notes[noteIndex] = newNote;
    setCurrentListing(tempListing);
    axios
      .put(`https://job-listing-viewer.herokuapp.com/update/${currentListing._id}`, currentListing)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
    handleCloseEdit();
  };

  const handleDeleteNote = () => {
    var tempListing = currentListing;
    tempListing.notes.splice(noteIndex, 1);
    setCurrentListing(tempListing);
    axios
      .put(`https://job-listing-viewer.herokuapp.com/update/${currentListing._id}`, currentListing)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
    handleCloseEdit();
  };

  const handleChangeStatus = (listing) => {
    setCurrentListing(listing);
    handleShowStatus();
  };
  const onEditNote = (note, listing, index) => {
    setCurrentListing(listing);
    setNoteIndex(index);
    setNewNote(note);
    handleShowEdit();
  };

  const handleEditStatus = (value) => {
    var tempListing = currentListing;
    tempListing.status = value;
    setCurrentListing(tempListing);
    axios
      .put(`https://job-listing-viewer.herokuapp.com/update/${currentListing._id}`, currentListing)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
    handleCloseStatus();
  };

  const onAddNote = (listing) => {
    setCurrentListing(listing);
    setNewNote("");
    handleShow();
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setNewNote(value);
    console.log(newNote);
  };


  return (
    <div style={{ width: "90%", textAlign: " center", margin: "auto auto" }}>
      <h1>Job Listings</h1>
      <Stack direction="horizontal">
        <Form.Select
          value={filterValue}
          style={{ width: "50%" }}
          onChange={(e) => setFilterValue(e.target.value)}
        >
          <option value="">No filter</option>
          <option value="invoicing">Invoicing</option>
          <option value="completed">Completed</option>
          <option value="scheduled">Scheduled</option>
          <option value="to priced">To priced</option>
          <option value="active">Active</option>
        </Form.Select>
        <Form.Select
          value={sortValue}
          style={{ width: "50%" }}
          onChange={(e) => setSortValue(e.target.value)}
        >
          <option value="">No sort</option>
          <option value="title">Title</option>
          <option value="description">Description</option>
          <option value="client">Client</option>
          <option value="tags">Tags</option>
          <option value="notes">Notes</option>
          <option value="createdAt">Creation Date</option>
        </Form.Select>
      </Stack>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{currentListing.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{ width: "100%", textAlign: " center", margin: "auto auto" }}
        >
          <div>Client: {currentListing.client}</div>
          <div>{currentListing.description}</div>
          <div>Status: {currentListing.status}</div>
          <div>
            Created on:{}
            {moment(currentListing.createdAt).format("YYYY/MM/DD HH:mm")}
          </div>
          <Form.Control
            placeholder="Note "
            name="note"
            style={{ marginBottom: "1rem" }}
            value={newNote}
            onChange={handleChange}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveNewNote}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEdit} onHide={handleCloseEdit}>
        <Modal.Header closeButton>
          <Modal.Title>{currentListing.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{ width: "100%", textAlign: " center", margin: "auto auto" }}
        >
          <div>Client: {currentListing.client}</div>
          <div>{currentListing.description}</div>
          <div>Status: {currentListing.status}</div>
          <div>
            Created on:{}
            {moment(currentListing.createdAt).format("YYYY/MM/DD HH:mm")}
          </div>
          <Form.Control
            placeholder="Note"
            name="note"
            style={{ marginBottom: "1rem" }}
            value={newNote}
            onChange={handleChange}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEdit}>
            Close
          </Button>
          <Button variant="danger" onClick={handleDeleteNote}>
            Delete Note
          </Button>
          <Button variant="primary" onClick={handleEditNote}>
            Confirm
          </Button>
        </Modal.Footer>

        {/* status modal */}
      </Modal>
      <Modal show={showStatus} onHide={handleCloseStatus}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body
          style={{ width: "100%", textAlign: " center", margin: "auto auto" }}
        >
          <Button
            variant="primary"
            value="active"
            onClick={(e) => handleEditStatus(e.target.value)}
          >
            Active
          </Button>
          <Button
            variant="primary"
            value="scheduled"
            onClick={(e) => handleEditStatus(e.target.value)}
          >
            Scheduled
          </Button>
          <Button
            variant="primary"
            value="to priced"
            onClick={(e) => handleEditStatus(e.target.value)}
          >
            To priced
          </Button>
          <Button
            variant="primary"
            value="invoicing"
            onClick={(e) => handleEditStatus(e.target.value)}
          >
            Invoicing
          </Button>
          <Button
            variant="primary"
            value="completed"
            onClick={(e) => handleEditStatus(e.target.value)}
          >
            Completed
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseStatus}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      {listings ? (
        <>
          {listings.map((listing) => {
            return (
              <div
                style={{
                  border: "solid lightgray 1px",
                  borderRadius: "8px",
                  marginBottom: "1rem",
                  padding: "1rem",
                }}
              >
                <h4>{listing.title}</h4>
                <p>{listing.description}</p>
                {listing.notes ? (
                  <>
                    {listing.notes.map((note, index) => {
                      return (
                        <Button
                          variant="primary"
                          onClick={() => {
                            onEditNote(note, listing, index);
                          }}
                        >
                          <h4>{note}</h4>
                        </Button>
                      );
                    })}
                  </>
                ) : (
                  ""
                )}

                <div style={{ width: "100%", marginRight: "1rem" }}>
                  <h2>{listing.status}</h2>

                  <Button
                    style={{ width: "10%" }}
                    onClick={() => handleChangeStatus(listing)}
                  >
                    Change Status
                  </Button>

                  <Button
                    style={{ width: "10%" }}
                    onClick={() => onAddNote(listing)}
                  >
                    Add Note
                  </Button>
                </div>
              </div>
            );
          })}
        </>
      ) : (
        ""
      )}
    </div>
  );
}
