import { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import { addTopic, resetNewTopic, getSpaces } from "../redux/slices/topicSlice";
import { Link } from "react-router-dom";

const NewTopic = () => {
  const dispatch = useDispatch();

  const { message, isLoading, isSuccess, isError, newTopicURL } =
    useSelector((state) => state.topic.addTopic);

  const { spaces } = useSelector((state) => state.topic);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);

  // Load spaces + reset state
  useEffect(() => {
    dispatch(resetNewTopic());
    dispatch(getSpaces());
  }, [dispatch]);

  // Reset form after success
  useEffect(() => {
    if (isSuccess) {
      setTitle("");
      setContent("");
      setSelectedTags([]);
      setSelectedSpace(null);
    }
  }, [isSuccess]);

  const options =
    spaces?.map((space) => ({
      value: space.name,
      label: space.name,
    })) || [];

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    if (!content.trim()) {
      alert("Content is required");
      return;
    }

    // convert tags safely
    const formattedTags =
      selectedTags?.length > 0
        ? selectedTags.map((tag) => ({
            value: tag.value,
          }))
        : [];

    dispatch(
      addTopic({
        title: title.trim(),
        content: content.trim(),
        selectedSpace: selectedSpace || null,
        selectedTags: formattedTags,
      })
    );
  };

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col lg={8}>
          <h3 className="mb-4">Add New Topic</h3>

          {/* MESSAGE */}
          {message && (
            <Alert variant={isError ? "danger" : "success"}>
              {message}
              {newTopicURL && (
                <>
                  {" "}
                  <Link to={newTopicURL}>View Topic</Link>
                </>
              )}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            {/* TITLE */}
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter topic title"
                value={title}
                disabled={isLoading}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>

            {/* CONTENT */}
            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Enter topic content"
                value={content}
                disabled={isLoading}
                onChange={(e) => setContent(e.target.value)}
              />
            </Form.Group>

            {/* SPACE */}
            <Form.Group className="mb-3">
              <Form.Label>Space</Form.Label>
              <Select
                options={options}
                placeholder="Select space"
                isDisabled={isLoading}
                value={
                  options.find((opt) => opt.value === selectedSpace) || null
                }
                onChange={(e) => setSelectedSpace(e?.value)}
              />
            </Form.Group>

            {/* TAGS */}
            <Form.Group className="mb-3">
              <Form.Label>Tags</Form.Label>
              <CreatableSelect
                isMulti
                placeholder="Add tags"
                isDisabled={isLoading}
                value={selectedTags}
                onChange={(e) => setSelectedTags(e || [])}
              />
            </Form.Group>

            {/* SUBMIT */}
            <Button type="submit" disabled={isLoading} className="w-100">
              {isLoading ? "Creating..." : "Create Topic"}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default NewTopic;