import React, { useEffect } from 'react';
import { CircularProgress } from '@mui/material';
import { Link } from 'react-router-dom';
import { Button, Modal, Input, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { InputBase, Pagination, Grid } from '@mui/material';
import { Search } from '@mui/icons-material';
import { getPrograms, createProgram } from '../../api/hr/programApi';
import './list-program.css';

const programPerPage = 4;

function ListProgram() {
  const [loading, setLoading] = React.useState(false);
  const [programs, setPrograms] = React.useState([]);
  const [page, setPage] = React.useState(1);
  const [name, setName] = React.useState('');
  const [isModalVisible, setIsModalVisible] = React.useState(false);

  console.log({ programs, page });

  const fetchPrograms = async (value) => {
    setLoading(true);
    const result = await getPrograms();
    setPrograms(result || []);
    setLoading(false);
  };

  // get the list of programs with pagination
  const getArrProgramsWithPagination = (page, programs) => {
    const start = (page - 1) * programPerPage;
    const end = page * programPerPage;
    return programs.slice(start, end);
  };

  useEffect(() => {
    fetchPrograms(page);
  }, [page]);

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    submitNewProgram();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const changeNewName = (e) => {
    setName(e.target.value);
  };

  const submitNewProgram = () => {
    if (name) {
      const newProgram = {
        title: name,
        imageId: 1,
      };
      const handleCreatePhase = async () => {
        message.loading({ content: 'Creating...' }).then(async () => {
          await createProgram(newProgram);
          fetchPrograms();
          message.success({ content: 'Created', key: 'success' });
        });
      };
      handleCreatePhase();
      setIsModalVisible(false);
      setName('');
    }
  };

  return (
    <div className="list-program">
      <div className="list-program__container">
        <div className="top">
          <div className="page-name">Programs</div>
          <div className="add-program">
            <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>
              Create new program
            </Button>
          </div>
        </div>
        <div className="filter-search">
          <div className="filter">Filter</div>
          <div className="search">
            <Search />
            <InputBase placeholder="Search" />
          </div>
        </div>
        <div className="programs">
          {loading ? (
            <CircularProgress />
          ) : (
            <div className="programs__container">
              <Grid container spacing={2}>
                {getArrProgramsWithPagination(page, programs).map((program) => {
                  return (
                    <Grid key={program.id} item xs={12} sm={6} lg={3}>
                      <div className="program">
                        <div className="cover-photo"></div>
                        <div className="program-name">
                          <Link className="link" to="/">
                            {program.title}
                          </Link>
                        </div>
                      </div>
                    </Grid>
                  );
                })}
              </Grid>
            </div>
          )}
        </div>
        <div className="pagination">
          <Pagination
            count={Math.ceil(programs?.length / 4)}
            shape="rounded"
            color="primary"
            page={page}
            onChange={handleChangePage}
          />
        </div>
      </div>
      <Modal
        className="modal"
        title="Create new phase"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Create
          </Button>,
        ]}
      >
        <div className="form">
          <div className="field">
            <label>Name</label>
            <Input value={name} onChange={changeNewName} />
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ListProgram;
