//import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import TaskList from '../components/TaskList';

describe('TaskList Component', () => {
  test('renders task list correctly', () => {
    render(<TaskList />);

    // Check that the initial tasks are rendered
    expect(screen.getByText('1. Outline Plot')).toBeInTheDocument();
    expect(screen.getByText('2. Develop Characters')).toBeInTheDocument()
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
        expect(screen.getByText('4. Write Chapter 1')).toBeInTheDocument();
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
            target: { value: '9' },
        });
    
        // Submit the form
        fireEvent.click(screen.getByText('Update Task'));
    
        // Check that the task is updated
        expect(screen.getByText('1. Write Chapter 2')).toBeInTheDocument();
    });

    // test editing the task estimate
    test('edits a task estimate', () => {
        render(<TaskList />);
    
        // Click the Edit button for the first task
        fireEvent.click(screen.getAllByText('Edit')[0]);
    
        // Fill out the form
        fireEvent.change(screen.getByLabelText('Estimate (Pomodoros):'), {
            target: { value: '42' },
        });
    
        // Submit the form
        fireEvent.click(screen.getByText('Update Task'));
    
        // Check that the task estimate is updated
        expect(screen.getByText('Estimate: 42 pomodoros')).toBeInTheDocument();
    });

    test('deletes a task', () => {
        render(<TaskList />);

        // Click the delete button for the third task
        fireEvent.click(screen.getAllByText('Delete')[2]);
        expect(screen.queryByText('Generate a theme')).not.toBeInTheDocument();
    });

    // add a subtask
    // test('adds a subtask to a task', () => {
    //     render(<TaskList />);
      
    //     // Add a new task
    //     fireEvent.change(screen.getByLabelText('Task Name:'), {
    //       target: { value: 'Write Introduction' },
    //     });
    //     fireEvent.change(screen.getByLabelText('Estimate (Pomodoros):'), {
    //       target: { value: 2 },
    //     });
    //     fireEvent.click(screen.getByText('Add Task'));
      
    //     expect(screen.getByText('4. Write Introduction')).toBeInTheDocument();
      
    //     //Click the "Add Subtask" button
    //     fireEvent.click(screen.getAllByText('Add Subtask')[0]);

    //     // use formid to target subtask fields (assuming formid='subtask-1')
    //     fireEvent.change(screen.getByLabelText('Subtask Name:'), {
    //       target: { value: 'Research topic' },
    //     });
      
    //     fireEvent.click(screen.getByText('Add This Subtask'));
      
    //     expect(screen.getByText('1.1. Research topic')).toBeInTheDocument();
    //   });

});
