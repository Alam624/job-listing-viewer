import { Button, Form } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";

export default function CreateListing() {
  const [listing, setListing] = useState({
    title: "",
    description: "",
    client: "",
    status: "",
    notes: [],
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("/create", listing)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setListing((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  const handleTagChange = (e) => {
    const {name,value} = e.target;
    setListing((prev)=> {
        return{
            ...prev,
            [name]: value.split(',')
        }
    });
  }
  

  return (
    <div style={{ width: "90%", margin: "auto auto", textAlign: "center" }}>
      <h1> Create a Listing</h1>
      <Form>
        <Form.Group>
          <Form.Control
            name="title"
            placeholder="Title"
            style={{ marginBottom: "1rem" }}
            onChange={handleChange}
            value={listing.title}
          />
          <Form.Control
            name="description"
            placeholder="Description"
            style={{ marginBottom: "1rem" }}
            onChange={handleChange}
            value={listing.description}
          />
          <Form.Control
            name="client"
            placeholder="Client"
            style={{ marginBottom: "1rem" }}
            onChange={handleChange}
            value={listing.client}
          />
          <Form.Control
            name="status"
            placeholder="Status"
            style={{ marginBottom: "1rem" }}
            onChange={handleChange}
            value={listing.status}
          />
          <Form.Control
            name="tags"
            placeholder="Tags"
            style={{ marginBottom: "1rem" }}
            onChange={handleTagChange}
            value={listing.tags}
          />
          <Form.Control
            name="notes"
            placeholder="Notes"
            style={{ marginBottom: "1rem" }}
            onChange={handleTagChange}
            value={listing.notes}
          />
        </Form.Group>
        <Button
          style={{ width: "100%", marginBottom: "1rem" }}
          variant="outline-success"
          onClick={handleSubmit}
        >
          Create Listing
        </Button>
      </Form>
    </div>
  );
}
