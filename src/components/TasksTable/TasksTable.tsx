import React, { useMemo } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
  ButtonGroup,
  Text,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { useTable, Column } from 'react-table';
import { formatDistance } from 'date-fns';

import { Task, TaskStatus, User } from '../../types/admin';
import { AdminLoadingSpinner } from '../Loading/AdminLoadingSpinner';

interface TasksTableProps {
  tasks: Task[];
  user: User | null;
  isAuthenticated: boolean;
  isLoading?: boolean;
  error?: string | null;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  isUpdating?: boolean;
  updatingTaskId?: string;
}

const TasksTable: React.FC<TasksTableProps> = ({
  tasks,
  user,
  isAuthenticated,
  isLoading = false,
  error = null,
  onStatusChange,
  isUpdating = false,
  updatingTaskId,
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  // // Check if user has admin permissions - now we check per task
  const hasAnyAdminTasks = useMemo(() => {
    return tasks.some(task => task.isAdmin === true);
  }, [tasks]);

  // Status badge color mapping
  const getStatusColor = (status: TaskStatus): string => {
    switch (status) {
      case 'approved':
        return 'green';
      case 'rejected':
        return 'red';
      case 'pending':
        return 'yellow';
      default:
        return 'gray';
    }
  };

  // Format created date
  const formatCreatedAt = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return formatDistance(date, new Date(), { addSuffix: true });
    } catch {
      return 'Unknown';
    }
  };

  // Define table columns
  const columns: Column<Task>[] = useMemo(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
        Cell: ({ value }: { value: string }) => (
          <Text fontSize="sm" fontFamily="mono" color="gray.500">
            {value.slice(0, 8)}
          </Text>
        ),
      },
      {
        Header: 'Name',
        accessor: 'name',
        Cell: ({ value }: { value: string }) => (
          <Text fontWeight="medium" noOfLines={2}>
            {value}
          </Text>
        ),
      },
      {
        Header: 'Description',
        accessor: 'description',
        Cell: ({ value }: { value: string }) => (
          <Text fontSize="sm" noOfLines={3} maxW="300px">
            {value}
          </Text>
        ),
      },
      {
        Header: 'Status',
        accessor: 'approval_status',
        Cell: ({ value }: { value: TaskStatus }) => (
          <Badge colorScheme={getStatusColor(value)} variant="solid">
            {value.toUpperCase()}
          </Badge>
        ),
      },
      {
        Header: 'Created By',
        accessor: 'createdBy',
        Cell: ({ value }: { value?: string }) => (
          <Text fontSize="sm" color="gray.600">
            {value || 'Unknown'}
          </Text>
        ),
      },
      {
        Header: 'Created',
        accessor: 'createdAt',
        Cell: ({ value }: { value: string }) => (
          <Text fontSize="sm" color="gray.600">
            {formatCreatedAt(value)}
          </Text>
        ),
      },
      ...(hasAnyAdminTasks
        ? [
            {
              Header: 'Actions',
              id: 'actions',
              Cell: ({ row }: { row: { original: Task } }) => {
                const task = row.original;
                const isTaskUpdating = isUpdating && updatingTaskId === task.id;
                
                // Only show actions if this specific task has isAdmin = true
                if (!task.isAdmin || task.approval_status !== 'pending') {
                  return (
                    <Text fontSize="sm" color="gray.500">
                      {task.approval_status !== 'pending' ? 'No actions available' : 'Not authorized'}
                    </Text>
                  );
                }

                return (
                  <ButtonGroup size="sm" spacing={2}>
                    <Button
                      colorScheme="green"
                      variant="solid"
                      onClick={() => onStatusChange(task.id, 'approved')}
                      isDisabled={isUpdating}
                      isLoading={isTaskUpdating}
                      loadingText="Approving..."
                    >
                      Approve
                    </Button>
                    <Button
                      colorScheme="red"
                      variant="solid"
                      onClick={() => onStatusChange(task.id, 'rejected')}
                      isDisabled={isUpdating}
                      isLoading={isTaskUpdating}
                      loadingText="Rejecting..."
                    >
                      Reject
                    </Button>
                  </ButtonGroup>
                );
              },
            },
          ]
        : []),
    ],
    [hasAnyAdminTasks, onStatusChange, isUpdating, updatingTaskId, tasks]
  );

  // Sort tasks by creation date (most recent first)
  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [tasks]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data: sortedTasks });

  // Loading state
  if (isLoading) {
    return (
      <AdminLoadingSpinner
        message="Loading tasks..."
        details="Fetching task data from server"
        minHeight="200px"
        size="lg"
      />
    );
  }

  // Error state
  if (error) {
    return (
      <Alert status="error" borderRadius="md">
        <AlertIcon />
        <AlertTitle>Error loading tasks!</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  // Empty state
  if (tasks.length === 0) {
    return (
      <Box 
        textAlign="center" 
        py={10}
        bg={bgColor}
        borderRadius="md"
        border="1px"
        borderColor={borderColor}
      >
        <Text fontSize="lg" color="gray.500">
          No tasks available
        </Text>
        <Text fontSize="sm" color="gray.400" mt={2}>
          Tasks will appear here when they are created
        </Text>
      </Box>
    );
  }

  return (
    <Box overflowX="auto" bg={bgColor} borderRadius="md" border="1px" borderColor={borderColor}>
      <Table {...getTableProps()} variant="simple">
        <Thead>
          {headerGroups.map((headerGroup, headerGroupIndex) => (
            <Tr {...headerGroup.getHeaderGroupProps()} key={headerGroupIndex}>
              {headerGroup.headers.map((column, columnIndex) => (
                <Th {...column.getHeaderProps()} key={columnIndex}>
                  {column.render('Header')}
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {rows.map((row, rowIndex) => {
            prepareRow(row);
            return (
              <Tr {...row.getRowProps()} key={rowIndex}>
                {row.cells.map((cell, cellIndex) => (
                  <Td {...cell.getCellProps()} key={cellIndex}>
                    {cell.render('Cell')}
                  </Td>
                ))}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
      
      {!isAuthenticated && (
        <Box p={4} borderTop="1px" borderColor={borderColor}>
          <Text fontSize="sm" color="gray.500" textAlign="center">
            Authenticate with Discord to access administrative functions
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default TasksTable;