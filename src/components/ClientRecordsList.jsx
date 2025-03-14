import { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  IconButton,
  Typography,
  styled
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EditRecordDialog from './EditRecordDialog';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import { useSelector } from 'react-redux';

const ClientRecordsList = ({
  records,
  page,
  rowsPerPage,
  onChangePage,
  onChangeRowsPerPage,
  onEditRecord,
  onDeleteRecord
}) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const paginatedRecords = useMemo(() => {
    return records.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [records, page, rowsPerPage]);

  const emptyRows = useMemo(() => {
    return page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - records.length)
      : 0;
  }, [page, rowsPerPage, records.length]);

  const handleEditClick = (record) => {
    setSelectedRecord(record);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (record) => {
    setSelectedRecord(record);
    setDeleteDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setSelectedRecord(null);
  };

  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setSelectedRecord(null);
  };

  const handleEditSubmit = (editedRecord) => {
    const result = onEditRecord(editedRecord);
    if (result.success) {
      setEditDialogOpen(false);
      setSelectedRecord(null);
    }
    return result;
  };

  const handleDeleteConfirm = () => {
    onDeleteRecord(selectedRecord.id);
    setDeleteDialogOpen(false);
    setSelectedRecord(null);
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="client records table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.length > 0 ? (
              paginatedRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.id}</TableCell>
                  <TableCell>{record.name}</TableCell>
                  <TableCell>{record.email}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => handleEditClick(record)}
                      aria-label="edit"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteClick(record)}
                      aria-label="delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow style={{ height: 53 }}>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body1">
                    No records found. Please upload a JSON file.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={5} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {records.length > 0 && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={records.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={onChangePage}
          onRowsPerPageChange={onChangeRowsPerPage}
        />
      )}

      {selectedRecord && (
        <>
          <EditRecordDialog
            open={editDialogOpen}
            record={selectedRecord}
            onClose={handleEditDialogClose}
            onSubmit={handleEditSubmit}
            existingRecords={records}
          />
          <DeleteConfirmDialog
            open={deleteDialogOpen}
            record={selectedRecord}
            onClose={handleDeleteDialogClose}
            onConfirm={handleDeleteConfirm}
          />
        </>
      )}
    </>
  );
};

export default ClientRecordsList; 