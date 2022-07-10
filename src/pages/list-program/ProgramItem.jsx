import React, {useEffect} from 'react';
import {Link} from 'react-router-dom';
import {Button, message, Tooltip, Popconfirm} from 'antd';
import {DeleteOutlined} from '@ant-design/icons';
import './list-program.css';
import {removeProgram} from "../../api/hr/programApi";
import {getUserProfileById} from "../../api/userProfile";

function ProgramItem({program, refreshPrograms}) {
  const [userProfile, setUserProfile] = React.useState({});

  const fetchUserProfile = async () => {
    const result = await getUserProfileById(program.authorId);
    setUserProfile(result);
  }

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([fetchUserProfile()]);
    }
    fetchData();
  }, []);

  const renderName = () => {
    if (userProfile.firstName && userProfile.lastName) {
      return `${userProfile.firstName} ${userProfile.lastName}`;
    } else {
      return `${userProfile.username}`;
    }
  }

  const handleRemoveProgram = async (id) => {
    await removeProgram(id);
    message.success({content: 'Removed', key: 'success'});
    refreshPrograms();
  }

  return (<div className="program">
    <div className="cover-photo">
      <img
        src={program.image.imageLink}
        alt="img"
      />
      <Popconfirm
        title="Are you sure delete this program?"
        onConfirm={() => handleRemoveProgram(program.id)}
      >
        <Tooltip className={"remove-btn"} title="remove">
          <Button type="circle" shape="circle"

                  icon={<DeleteOutlined/>}/>
        </Tooltip>
      </Popconfirm>
    </div>
    <div className="program-name">
      <Link className="link" to={`/programs/${program.id}`}>
        {program.title}
      </Link>

      {userProfile?.username ? (<div className={"author"}>
        <img
          alt={"name"}
          style={{
            width: '40px', height: '40px', borderRadius: '50%',

          }}
          src={userProfile.avatar || "https://simg.nicepng.com/png/small/128-1280406_view-user-icon-png-user-circle-icon-png.png"}/>
        <div className={"name"}>{renderName()}</div>
      </div>) : (<></>)}

    </div>
  </div>);
}

export default ProgramItem;
