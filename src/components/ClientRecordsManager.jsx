import { useState, useEffect } from 'react';
import { Box, Button, Paper } from '@mui/material';
import FileUploader from './FileUploader';
import ClientRecordsList from './ClientRecordsList';
import SearchBar from './SearchBar';
import { useDispatch, useSelector } from 'react-redux';
import { setRecords, updateRecord, deleteRecord } from '../store/slices/clientRecordsSlice';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { CLIENT_RECORDS_STORAGE_KEY } from '../constants/constant';

const ClientRecordsManager = () => {
  const dispatch = useDispatch();
  const clientRecords = useSelector(state => state.clientRecords.records);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  useEffect(() => {
    const storedRecords = localStorage.getItem(CLIENT_RECORDS_STORAGE_KEY);
    if (storedRecords) {
      try {
        const parsedRecords = JSON.parse(storedRecords);
        dispatch(setRecords(parsedRecords));
      } catch (error) {
        console.error('Error parsing stored records:', error);
      }
    }
  }, [dispatch]);

  const handleFileUpload = (fileData) => {
    if (!fileData || !Array.isArray(fileData)) return;

    const updatedRecords = [...clientRecords];
    fileData.forEach(newRecord => {
      if (!updatedRecords.some(record => record.email === newRecord.email)) {
        updatedRecords.push(newRecord);
      }
    });

    dispatch(setRecords(updatedRecords));
  };

  // Handle search functionality
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredRecords(clientRecords);
    } else {
      const lowercasedTerm = searchTerm.toLowerCase();
      const filtered = clientRecords.filter(record =>
        record.id.toString().includes(lowercasedTerm) ||
        record.name.toLowerCase().includes(lowercasedTerm) ||
        record.email.toLowerCase().includes(lowercasedTerm)
      );
      setFilteredRecords(filtered);
    }
    setPage(0);
  }, [searchTerm, clientRecords]);

  // Handle record edit
  const handleEditRecord = (editedRecord) => {
    const isDuplicateEmail = clientRecords.some(
      record => record.email === editedRecord.email && record.id !== editedRecord.id
    );

    if (isDuplicateEmail) {
      return { success: false, message: 'Email address must be unique' };
    }

    dispatch(updateRecord(editedRecord));
    return { success: true };
  };

  // Handle record deletion
  const handleDeleteRecord = (recordId) => {
    dispatch(deleteRecord(recordId));
  };

  // Handle pagination changes
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ p: 2, mb: 2, display: "flex", gap: 5, flexWrap: {
        xs: "wrap",
        sm:"nowrap"
      } }}>
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        <Button
          variant="contained"
          component="label"
          startIcon={<UploadFileIcon />}
          sx={{
            textWrap: "nowrap",
            paddingInline: "40px"
          }}
          onClick={()=>setUploadDialogOpen(true)}
        >
          Upload JSON File
        </Button>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <ClientRecordsList
          records={filteredRecords}
          page={page}
          rowsPerPage={rowsPerPage}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
          onEditRecord={handleEditRecord}
          onDeleteRecord={handleDeleteRecord}
        />
      </Paper>

      {
        uploadDialogOpen && (
          <FileUploader open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)} onFileUpload={handleFileUpload} />
        )
      }
    </Box>
  );
};

export default ClientRecordsManager;
