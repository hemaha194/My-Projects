import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodes,
  useUpdateNodeInternals,
} from 'react-flow-renderer';
import 'react-flow-renderer/dist/style.css';

const EditableNode = ({ id, label, onEditFinish }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedLabel, setEditedLabel] = useState(label);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onEditFinish(id, editedLabel);
  };

  return (
    <div onDoubleClick={handleDoubleClick}>
      {isEditing ? (
        <input
          type="text"
          value={editedLabel}
          onChange={(e) => setEditedLabel(e.target.value)}
          onBlur={handleBlur}
          autoFocus
        />
      ) : (
        <div>{label}</div>
      )}
    </div>
  );
};

const EditableFlow = () => {
  const [elements, setElements] = useNodes([]);

  useEffect(() => {
    setElements([
      {
        id: '1',
        type: 'input',
        data: { label: 'Double click to edit' },
        position: { x: 0, y: 0 },
      },
    ]);
  }, [setElements]);

  const updateNodeInternals = useUpdateNodeInternals();

  const handleEditFinish = (nodeId, editedLabel) => {
    updateNodeInternals(nodeId, {
      data: {
        label: editedLabel,
      },
    });
  };

  const onConnect = useCallback((params) => {
    setElements((nodes) => addEdge(params, nodes));
  }, [setElements]);

  return (
    <div style={{ height: '100vh' }}>
      <ReactFlow elements={elements} onConnect={onConnect} />
      {elements &&
        elements.map((element) => (
          <EditableNode
            key={element.id}
            id={element.id}
            label={element.data.label}
            onEditFinish={handleEditFinish}
          />
        ))}
    </div>
  );
};

export default () => (
  <ReactFlowProvider>
    <EditableFlow />
  </ReactFlowProvider>
);



<Dialog open={openFlashCard} onClose={handleCloseFlashcard}>
        <DialogContent style={{ maxWidth: '850px' }}>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <div style={{fontWeight: 'bold'}}>New Flashcard</div>
            <div><i className="fa-solid fa-xmark" onClick={handleCloseFlashcard}></i></div>
          </div>
          <br/>
          <hr/>
          <div style={{marginBottom:"8px"}}>
            <div>Front</div>
            <ReactQuill
              className="me-3"
              style={{
                // minHeight: '200px',
                height:"200px",
                width: '500px',
                borderRadius: '8px',
                border: '1px solid #ced4da', // Optional: Add border for better visibility
                overflow:'hidden'
              }}
              modules={{
                toolbar: [
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ list: 'ordered' }, { list: 'bullet' }],
                  ['link'],
                  ['clean'],
                ],
              }}
              // value={content}
              // onChange={(value) => setContent(value)}
              theme='snow'
            />
          </div>

          <div>
            <div>Back</div>
            <ReactQuill
              className="me-3"
              style={{
                // minHeight: '200px',
                height:"200px",
                width: '500px',
                borderRadius: '8px',
                border: '1px solid #ced4da', // Optional: Add border for better visibility
                overflow:'hidden'
              }}
              modules={{
                toolbar: [
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ list: 'ordered' }, { list: 'bullet' }],
                  ['link'],
                  ['clean'],
                ],
              }}
              // value={content}
              // onChange={(value) => setContent(value)}
              theme='snow'
            />
          </div>
          <Button
            className="btn-icon rounded-xl"
            variant="outlined"
            style={{ borderColor: 'grey' ,marginBottom:"15px",height:"30px",width:"170px"}}
            onClick={(e)=>{handleFlashCard()}}
          >
            <Typography variant="subtitle1" style={{ fontWeight: 'bold',color:"black" , textTransform: 'none'}}>
              Create Flashcard
            </Typography>
          </Button>
        </DialogContent>
      </Dialog>
