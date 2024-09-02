//import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import TaskList from '../components/TaskList';

describe('TaskList Component', () => {
  test('renders task list correctly', () => {
    render(<TaskList />);

    // Check that the initial tasks are rendered
    expect(screen.getByText('Outline Plot')).toBeInTheDocument();
    expect(screen.getByText('Develop Characters')).toBeInTheDocument()
  });

  // add a test to check that a new task can be added
    test('adds a new task', () => {
        render(<TaskList />);
    
        // Fill out the form
        fireEvent.change(screen.getByLabelText('Task Name:'), {
        target: { value: 'Write Chapter 1' },
        });
        fireEvent.change(screen.getByLabelText('Estimate (Pomodoros):'), {
        target: { value: '2' },
        });
    
        // Submit the form
        fireEvent.click(screen.getByText('Add Task'));
    
        // Check that the new task is rendered
        expect(screen.getByText('Write Chapter 1')).toBeInTheDocument();
    });

    // add a test to check that a task can be edited
    test('edits a task', () => {
        render(<TaskList />);
    
        // Click the Edit button for the first task
        fireEvent.click(screen.getAllByText('Edit')[0]);
    
        // Fill out the form
        fireEvent.change(screen.getByLabelText('Task Name:'), {
            target: { value: 'Write Chapter 2' },
        });
        fireEvent.change(screen.getByLabelText('Estimate (Pomodoros):'), {
            target: { value: '2' },
        });
    
        // Submit the form
        fireEvent.click(screen.getByText('Update Task'));
    
        // Check that the task is updated
        expect(screen.getByText('Write Chapter 2')).toBeInTheDocument();
    });

    test('deletes a task', () => {
        render(<TaskList />);

        // Click the delete button for the third task
        fireEvent.click(screen.getAllByText('Delete')[2]);
        expect(screen.queryByText('Generate a theme')).not.toBeInTheDocument();
    });


});
