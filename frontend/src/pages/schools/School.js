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
//import useStyles from "./styles";
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
import {useHistory,Link} from 'react-router-dom';


const positions = [
  toast.POSITION.TOP_LEFT,
  toast.POSITION.TOP_CENTER,
  toast.POSITION.TOP_RIGHT,
  toast.POSITION.BOTTOM_LEFT,
  toast.POSITION.BOTTOM_CENTER,
  toast.POSITION.BOTTOM_RIGHT,
];

const states = {
  active:"#3CD4A0", //success
  inactive:"#FF5C93", //secondary
  approved:"#3CD4A0",//success
  pending: "#FFC260",//warning
  declined: "#FF5C93", //secondary
};
const headerList=["School Name","School Type","School Group","City","State","UDISE Code",{
    name:"",
    options: {
        filter:false,
        viewColumns:false
    }
}];

export default function UsersPage(props) {
//  var classes = useStyles();
  var [notificationsPosition, setNotificationPosition] = useState(2);
  var [errorToastId, setErrorToastId] = useState(null);

  var [getValue,setGetValue] = useState([]);
  var [countRows, setCountRows] = useState(0);
  var [pageSize,setPageSize] = useState(5);         //change page size here
  var [nextLink,setNextLink] = useState('');
  var [prevLink,setPrevLink] = useState('');

let gresult;
  useEffect(() => {
    async function fetchData () {

    try{
        gresult = await axios.get(
        'http://localhost:8000/viewSchools/', {
            headers: {Authorization: 'Token '+localStorage.getItem('id_token')}

        }
        );
        console.log(gresult);console.log(localStorage.getItem('id_token'));
        for(var i = 0 ; i < gresult.data.results.length ; i++)
        {
            console.log("in for");
                setGetValue(getValue=>[...getValue,{
                    schoolName: gresult.data.results[i].schoolName,
                    schoolTypeCode: gresult.data.results[i].schoolTypeCodeID.codeName,
                    schoolGroup: gresult.data.results[i].schoolTypeCodeID.codeGroupID.codeGroupName,
                    city: gresult.data.results[i].addressID.city,
                    state:gresult.data.results[i].addressID.stateID.name,
                    udise:gresult.data.results[i].UDISEcode,
                }])
                console.log(getValue);
        }
        setCountRows(countRows => gresult.data.count);
        setPageSize (pageSize => gresult.data.page_size);
        setNextLink(nextLink => gresult.data.links.next);
        setPrevLink(prevLink => gresult.data.links.previous);

    }catch(error){ console.log(error); }
    }
    fetchData();
    },[]);
    console.log(getValue);

   async function handlePageChange(newValue) {

       if(nextLink!=null) {
        gresult = await axios.get(nextLink , {
            headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
        });
        for(var i = 0 ; i < gresult.data.results.length ; i++)
        {
            console.log("in for");
                setGetValue(getValue=>[...getValue,{
                    schoolName: gresult.data.results[i].schoolName,
                    schoolTypeCode: gresult.data.results[i].schoolTypeCodeID.codeName,
                    schoolGroup: gresult.data.results[i].schoolTypeCodeID.codeGroupID.codeGroupName,
                    city: gresult.data.results[i].addressID.city,
                    state:gresult.data.results[i].addressID.stateID.name,
                    udise:gresult.data.results[i].UDISEcode,
                }])
                console.log(getValue);
        }
        setCountRows(countRows => gresult.data.count);
        setPageSize (pageSize => gresult.data.page_size);
        setNextLink(nextLink => gresult.data.links.next);
        setPrevLink(prevLink => gresult.data.links.previous);}
   }

  return (
    <>
      <PageTitle title="Schools"/>
      <Button variant="contained" style={{ marginBottom: '50px',marginLeft:'1100px'}} color="secondary"
      onClick={() => props.history.push("/app/user/add")}

      >ADD</Button>

      <Grid item xs={12}>
         <MUIDataTable
            title="School List"
            data={getValue.map(item => {
              return [
                  item.schoolName,
                  item.schoolTypeCode,
                  item.schoolGroup,
                  item.city,

                  item.state,

                  item.udise,
////                  <h4 style = {{color:states[item.status.toLowerCase()]}}>{item.status}</h4>,
////           <h4 style = {{color:states[item.approval.toLowerCase()]}}>{item.approval}</h4>,
//           <Link to={{
//                pathname :"/app/user/update",
//                data : item.userRoleID
//           }}>
//            {/* <Button //onClick={() => props1.history.push("/app/user/update")}
//            >UPDATE</Button> */}
//            <IconButton >
//            <Edit />{/*onClick={() => props.history.push("/app/user/update")}  */}
//          </IconButton></Link>
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


}
