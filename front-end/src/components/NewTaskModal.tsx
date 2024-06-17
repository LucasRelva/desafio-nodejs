import React, { useEffect, useState } from 'react';
import './styles/NewTaskModal.css';
import { createTask, fetchTags } from '../services/taskService.ts';

interface Tag {
  id: number;
  title: string;
}

interface NewTaskModalProps {
  projectId: number;
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: () => void;
}

const NewTaskModal: React.FC<NewTaskModalProps> = ({ projectId, isOpen, onClose, onTaskCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadTags = async () => {
      try {
        const response = await fetchTags(1, 1000);
        setTags(response);
      } catch (error) {
        setError('Error fetching tags');
      }
    };
    loadTags();
  }, []);

  const handleTagSelect = (tagId: number) => {
    setSelectedTags(prevSelectedTags =>
      prevSelectedTags.includes(tagId)
        ? prevSelectedTags.filter(id => id !== tagId)
        : [...prevSelectedTags, tagId],
    );
  };

  const handleCreateTask = async () => {
    try {
      await createTask(title, description, selectedTags, projectId);
      onTaskCreated();
      onClose();
    } catch (error) {
      setError('Error creating task');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Create New Task</h2>
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="tags-container">
          {tags.map(tag => (
            <label key={tag.id} className="tag">
              <input
                type="checkbox"
                checked={selectedTags.includes(tag.id)}
                onChange={() => handleTagSelect(tag.id)}
              />
              {tag.title}
            </label>
          ))}
        </div>
        <button onClick={handleCreateTask}>Create Task</button>
        <button onClick={onClose}>Close</button>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default NewTaskModal;
