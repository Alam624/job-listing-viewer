const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const PORT = process.env.PORT || 3001;

const listingSchema = mongoose.Schema({
  title: String,
  description: String,
  client: String,
  notes: [String],
  tags: [String],
  status: {
    type: String,
    enum: ["active", "scheduled", "invoicing", "completed", "to priced"],
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const Listing = mongoose.model("Listing", listingSchema);

app.get("/", (req, res) => {
  res.send("Hello there");
});

app.post("/create", async (req, res) => {
  await Listing.create({
    title: req.body.title,
    description: req.body.description,
    status: req.body.status,
    notes: req.body.notes,
    client: req.body.client,
    tags: req.body.tags,
  })
    .then((doc) => console.log(doc))
    .catch((err) => console.log(err));
});

app.get("/listings", async (req, res) => {
  try {
    let sort = req.query.sort || "title";
    let status = req.query.status || "All";

    const statusOptions = [
      "invoicing",
      "completed",
      "active",
      "scheduled",
      "to priced",
    ];

    status === "All"
      ? (status = [...statusOptions])
      : (status = req.query.status.split(","));
    req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

    let sortBy = {};
    if (sort[1]) {
      sortBy[sort[0]] = sort[1];
    } else {
      sortBy[sort[0]] = "asc";
    }

    const listings = await Listing.find().where("status").in([...status]).sort(sortBy);

    res.status(200).json(listings);

  } catch (error) {
    console.log(error);

  };
});

app.get("/listings/:filter", (req, res) => {
  Listing.find().sort({});
});

app.put("/update/:id", (req, res) => {
  console.log(req.body);
  Listing.findByIdAndUpdate(
    { _id: req.params.id },
    { notes: req.body.notes, status: req.body.status }
  )
    .then((doc) => console.log(doc))
    .catch((err) => console.log(err));
});

app.get("notes/:id", (req, res) => {
  Listing.findById({ _id: req.params.id }).then((item) => {
    res.json(item);
    console.log(item);
  });
});

mongoose
  .connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(PORT, () =>
      console.log(`Server Running on Port: http://localhost:${PORT}`)
    )
  )
  .catch((error) => console.log(`${error} did not connect`));
