import React, { useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import { Close as CloseIcon } from "@material-ui/icons";
import { ToastContainer, toast } from "react-toastify";
//import mock from "../dashboard/mock";
//import Table from "../dashboard/components/Table/Table";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";
import classnames from "classnames";
// styles
import "react-toastify/dist/ReactToastify.css";
import useStyles from "./styles";
import AddUser from "../../pages/users/AddUser"
import UpdateUser from  "../../pages/users/UpdateUser"
// components
import Widget from "../../components/Widget/Widget";
import PageTitle from "../../components/PageTitle/PageTitle";
import Notification from "../../components/Notification";
import { Typography, Button } from "../../components/Wrappers/Wrappers";
import axios from 'axios';
//extra imports from ayush
import MUIDataTable from "mui-datatables";
import green from '@material-ui/core/colors/green';
import IconButton from '@material-ui/core/IconButton';
import Edit from "@material-ui/icons/Edit"
import {useHistory,Link,Route,Redirect} from 'react-router-dom';


const positions = [
  toast.POSITION.TOP_LEFT,
  toast.POSITION.TOP_CENTER,
  toast.POSITION.TOP_RIGHT,
  toast.POSITION.BOTTOM_LEFT,
  toast.POSITION.BOTTOM_CENTER,
  toast.POSITION.BOTTOM_RIGHT,
];

const userStatus = { active : "00", approved : "01" , inactive : "02"};

const states = {
  active:"#3CD4A0", //success
  inactive:"#FF5C93", //secondary
  approved:"#3CD4A0",//success
  pending: "#FFC260"//warning
};
const headerList=["Name","Email","Phone","Role","Created On","Created By","Status","Approval",{
    name:"",
    options: {
        filter:false,
        viewColumns:false
    }
}];

export default function UsersPage(props) {
  var classes = useStyles();
  var [notificationsPosition, setNotificationPosition] = useState(2);
  var [errorToastId, setErrorToastId] = useState(null);

  var [getValue,setGetValue] = useState([]);
  var [countRows, setCountRows] = useState(0);
  var [pageSize,setPageSize] = useState(10);         //change page size here
  var [nextLink,setNextLink] = useState('');
  var [prevLink,setPrevLink] = useState('');

let gresult;

  useEffect(() => {
    async function fetchData () {

    try{
        gresult = await axios.get(
        'http://localhost:8000/viewUsers/', {
            headers: {Authorization: 'Token '+localStorage.getItem('id_token')}

        }
        );
        console.log(gresult);console.log(localStorage.getItem('id_token'));
        for(var i = 0 ; i < gresult.data.results.length ; i++)
        {
            console.log("in for");
                setGetValue(getValue=>[...getValue,{
                    userRoleID: gresult.data.results[i].userRoleID,
                    loginID: gresult.data.results[i].userID.loginID,
                    username: gresult.data.results[i].userID.username,
                    role: gresult.data.results[i].roleID.roleName,
                    created_by:gresult.data.results[i].userID.created_by,
                    created_on:gresult.data.results[i].userID.created_on,
                    status:gresult.data.results[i].userID.is_active,
                    approval: gresult.data.results[i].userID.is_active,
                    phone:gresult.data.results[i].userID.phone
                }])
                console.log(getValue);
        }
        setCountRows(countRows => gresult.data.count);
        setPageSize (pageSize => gresult.data.page_size);
        setNextLink(nextLink => gresult.data.links.next);
        setPrevLink(prevLink => gresult.data.links.previous);

//        setInterval(() => {
//            handlePageChange();
//        },5000);

    }catch(error){ console.log(error); }
    }
    fetchData();
    },[]);
    console.log(getValue);

   async function handlePageChange() {

       if(nextLink!=null) {
        gresult = await axios.get(nextLink , {
            headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
        });
        for(var i = 0 ; i < gresult.data.results.length ; i++)
        {
            console.log("in for");
                setGetValue(getValue=>[...getValue,{
                    userRoleID: gresult.data.results[i].userRoleID,
                    loginID: gresult.data.results[i].userID.loginID,
                    username: gresult.data.results[i].userID.username,
                    role: gresult.data.results[i].roleID.roleName,
                    created_by:gresult.data.results[i].userID.created_by,
                    created_on:gresult.data.results[i].userID.created_on,
                    status:gresult.data.results[i].userID.is_active,
                    approval:gresult.data.results[i].userID.is_active,
                    phone:gresult.data.results[i].userID.phone,

                }])
                console.log(getValue);
//                colorMatch(gresult.data.results[i].userID.is_active,gresult.data.results[i].userID.is_active);
        }
        setCountRows(countRows => gresult.data.count);
        setPageSize (pageSize => gresult.data.page_size);
        setNextLink(nextLink => gresult.data.links.next);
        setPrevLink(prevLink => gresult.data.links.previous);}


   }

    const finalApproval = (approval) => {

        if(approval == userStatus.approved )
        {
            return 'APPROVED';
        }
        else if(approval == userStatus.active )
        {
            return 'PENDING';
        }
        else
            return '';
   }

   const finalStatus = (status) => {
        if(status == userStatus.active || status == userStatus.approved )
        {
            return 'ACTIVE';
        }
        if(status == userStatus.inactive )
        {
            return 'INACTIVE';
        }
   }

  return (
    <>
      <PageTitle title="Users"/>
      <Button color="primary" variant="contained" style={{ marginBottom: '50px',marginLeft:'1100px' }}
      onClick={() => props.history.push("/app/user/add")}

      >ADD</Button>

      <Grid item xs={12}>
         <MUIDataTable
            title="User List"
            data={getValue.map(item => {
              return [
                  item.username,
                  item.loginID,
                  item.phone,
                  item.role,

                  item.created_on,

                  item.created_by,

                  <h4 style = {{color:states[finalStatus(item.status).toLowerCase()]}}>{finalStatus(item.status)}</h4>,
                  <h4 style = {{color:states[finalApproval(item.approval).toLowerCase()]}}>{finalApproval(item.approval)}</h4>,
           <Link to={{
                pathname :"/app/user/update",
                data : item.userRoleID
           }}>
            <IconButton >
            <Edit />
          </IconButton>
          </Link>
          ]
          })}
           columns={headerList}
             options={{
               selectableRows:false,
               rowsPerPage: pageSize,
               print:false,
               serverSide: false,
                rowsPerPageOptions:[pageSize],
                count: countRows ,
                onChangePage: () => handlePageChange()
              }}

          />
        </Grid>
    </>
  );

  // #############################################################
  function sendNotification(componentProps, options) {
    return toast(
      <Notification
        {...componentProps}
        className={classes.notificationComponent}
      />,
      options,
    );
  }
  function testingFunction()
  {
    
      //let path='/app/notifications/add';
      //let history= useHistory();
      //history.push(path)
    
    
    props.history.push('/app/notifications/add');   
    
  }
  function retryErrorNotification() {
    var componentProps = {
      type: "message",
      message: "Message was sent successfully!",
      variant: "contained",
      color: "success",
    };
    toast.update(errorToastId, {
      render: <Notification {...componentProps} />,
      type: "success",
    });
    setErrorToastId(null);
  }

  function handleNotificationCall(notificationType) {
    var componentProps;

    if (errorToastId && notificationType === "error") return;

    switch (notificationType) {
      case "info":
        componentProps = {
          type: "feedback",
          message: "New user feedback received",
          variant: "contained",
          color: "primary",
        };
        break;
      case "error":
        componentProps = {
          type: "message",
          message: "Message was not sent!",
          variant: "contained",
          color: "secondary",
          extraButton: "Resend",
          extraButtonClick: retryErrorNotification,
        };
        break;
      default:
        componentProps = {
          type: "shipped",
          message: "The item was shipped",
          variant: "contained",
          color: "success",
        };
    }

    var toastId = sendNotification(componentProps, {
      type: notificationType,
      position: positions[notificationsPosition],
      progressClassName: classes.progress,
      onClose: notificationType === "error" && (() => setErrorToastId(null)),
      className: classes.notification,
    });

    if (notificationType === "error") setErrorToastId(toastId);
  }

  function changeNotificationPosition(positionId) {
    setNotificationPosition(positionId);
  }
}

// #############################################################
function CloseButton({ closeToast, className }) {
  return <CloseIcon className={className} onClick={closeToast} />;
}
