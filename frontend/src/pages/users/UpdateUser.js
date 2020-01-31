import React, { Component } from 'react';
import {Route , Redirect , useHistory} from 'react-router-dom'

import PageTitle from "../../components/PageTitle/PageTitle";
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import validator from 'validator';
import ErrorIcon from '@material-ui/icons/Error';

import { RadioGroup, RadioButton} from 'react-radio-buttons';
 import DatePicker from 'react-date-picker';
import { Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Select from 'react-select';
import Button from '@material-ui/core/Button';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import InputAdornment from '@material-ui/core/InputAdornment';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import clsx from 'clsx';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';

import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import {useUserState } from "../../context/UserContext";

import axios from 'axios';


const userStatus = { active : "00", approved : "01" , inactive : "02"};

const options = [
  { value: 'M', label: 'M' },
  { value: 'F', label: 'F' },
  { value: 'other', label: 'Other' },
];

const options_role = [
  { value: 'admin', label: 'Admin' },
  ];

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  margin: {
    margin: theme.spacing(1),
  },
  withoutLabel: {
    marginTop: theme.spacing(3),
  },
  textField: {
    width: 200,
  },
  formControl: {
    margin: theme.spacing(3),
  },
}))
//var dataX = {
//    userID:"",
//    username:"",
//    role:"",
//    phone:"",
//    loginID:""
//};

//const fetch = (Component: any) => {
//    return(props: any) => {
//        var userName = useUserState();
//
//        return <Component name={userName.name}{...props}/>
//    }
//}
//
//interface NameProps{
//    name:"";
//}

var dataX;
class UpdateUser extends Component {

    constructor(props){
        super(props);
        dataX = this.props.location.data
        console.log(dataX);
        this.state = {
            selectedOption: "",
            selectedOption_role: "",
            phone:"",
            value:"",
            userRoleID:dataX,
            userID:"",
            date: "",
            error: false,
            error_input:false,
            successValidation: false,
            approval:'',
            username:"",
            loginID:"",
            password:'',
            emailID: "",
            status:'',
            showPassword: false,
            error_pass:false,
           error_username:false,
           error_loginID:false,
           error_email:false,
           error_role:false,
           error_gender:false,
           dateString:"",
           onClick:false,
           openAlert:false,
           userName: localStorage.getItem("username"),
           finalStatus:""
        };

        console.log("st "+ this.state.userRoleID)
    }

    async componentDidMount(){

      console.log("cdm " + this.state.userRoleID);
    try{
        let gresult = await axios.get(
        'http://localhost:8000/GetData/'+this.state.userRoleID, {
//            params : {userID : dataX.userID},
            headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
        }
        );
        console.log(gresult);

                this.setState({
                    userID: gresult.data[0].userID.userID,
                    loginID: gresult.data[0].userID.loginID,
                    username: gresult.data[0].userID.username,
                    selectedOption_role: gresult.data[0].roleID.roleName,
                    phone:gresult.data[0].userID.phone,
                    selectedOption:gresult.data[0].userID.gender,
                    date:gresult.data[0].userID.birthdate,
                    dateString:gresult.data[0].userID.birthdate,
                    emailID:gresult.data[0].userID.loginID
                })

                if(gresult.data[0].userID.is_active == userStatus.active)
                {
                    this.setState({approval : userStatus.active , status : userStatus.active})
                }
                if(gresult.data[0].userID.is_active == userStatus.approved)
                {
                    this.setState({approval : userStatus.approval , status : userStatus.active})
                }
                if(gresult.data[0].userID.is_active == userStatus.inactive)
                {
                    this.setState({approval : userStatus.approved , status : userStatus.inactive})
                }

                console.log(this.state);
    }catch(error){ console.log(error); }}

  printdate(){
    console.log(typeof(this.state.date));
  }

      async fetchData()
    {
        console.log( this.state.dateString);
       if(this.state.dateString==this.state.date)
       {
          this.state.date = (""+this.state.date);
          console.log( this.state.date);
       }
       else
       {
          this.state.date = (""+this.state.date.getFullYear()+"-"+(this.state.date.getMonth()+1)+"-"+this.state.date.getDate());
           console.log( this.state.date);
       }

//       var finalStatus;
       if(this.state.approval == userStatus.active)
       {
            this.state.finalStatus= userStatus.active;
       }
       if(this.state.approval == userStatus.approved)
       {
            this.state.finalStatus= userStatus.approved;
       }
       if(this.state.status == userStatus.inactive)
       {
            this.state.finalStatus= userStatus.inactive;
       }
       console.log("final St " + this.state.finalStatus)

        try{
        let gresult = await axios.post(
        'http://localhost:8000/api/v1/update/'+this.state.userRoleID+"/", {
            "userID" :{

                "username":this.state.username,
                "email":this.state.emailID,
                "phone":this.state.phone,
//                "birthdate":data[4].toString(),
                "birthdate" : (""+this.state.date).toString(),
                "gender":this.state.selectedOption.value,
                "modified_by": this.state.userName,
                "is_active" : this.state.finalStatus
            },
            "roleID":{
                "roleName":this.state.selectedOption_role.value
            }
        },{
            headers: {
                'Content-Type' : 'application/json',
                Authorization: 'Token '+localStorage.getItem('id_token')
            }
        }
        );


        console.log("finl nantr "+this.state.finalStatus);
        }catch(error){ console.log(error); }

//        this.renderRedirect();

    }

    alertAndRedirect() {
        console.log("alertAnd Redirect")
        setTimeout(() => {this.setState({openAlert:true}); console.log("time 1 sec"); },1000);
        setTimeout(() => {
        console.log("time 5 sec");
            this.setState({openAlert:false, onClick:true});
        },3000);
    }

  onChange = date => {this.setState({ date });console.log(this.state.date)}


  handleClickOpen = () => {
    this.setState({openAlert:true});
  };

  handleClose = () => {
    this.setState({openAlert:false});
  };


  isValid = () => {
    const {value} = this.state;

    return validator.isMobilePhone(value,"en-IN")  ;

  }
  handleInputChange = ( newValue) => {
    // reset errors and validation as well
    this.setState({
      value: newValue,
      error: false,
      error_input:false,
      successValidation: false,


     });

     if(!validator.isMobilePhone(newValue,"en-IN") && !validator.isLength(newValue,{min:0, max:10} ) ){
       this.setState({error_input:true});
     }

  };

  onSubmit = () => {
    if(this.isValid()) {
        this.setState({successValidation: true, error: false});
    } else {
        this.setState({error: true});

    }


    this.printdate();
//  if(this.state.password=='')
//  {
//this.setState({error_pass:true})
//  }

  if(this.state.username=='')
  {
this.setState({error_username:true})
  }


  if(this.state.loginID=='')
  {
this.setState({error_loginID:true})
  }

  if(!validator.isEmail(this.state.emailID)){
      this.setState({error_email:true})
  }

  if(this.state.selectedOption_role==null)
  {
    this.setState({error_role:true});
  }
  if(this.state.selectedOption==null)
  {
    this.setState({error_gender:true});

  }
     if(this.state.error == false && this.state.error_email== false &&
    this.state.error_gender == false && this.state.error_loginID == false &&
    this.state.error_role==false && this.state.error_username == false)
    {
        this.fetchData();
        this.alertAndRedirect();
//        this.renderRedirect();
    }

  }

//   renderRedirect = () => {
//        return ( );
//   }

  handleChange = selectedOption => {
    this.setState({ selectedOption,error_gender:false });
    console.log(`Option selected:`, selectedOption);
  };

  handleStatusChange = (newValue) => {
      this.setState({status:newValue})  //ALWAYS SEND NEWVALUE!!! THAT IS CURRENT VALUE, STATUS IS JUNA VALUE.. :-/
    console.log(this.state.status + ":"+newValue);
  };


  handleApprovalChange = (newValue) => {
    this.setState({approval:newValue})  //ALWAYS SEND NEWVALUE!!! THAT IS CURRENT VALUE, STATUS IS JUNA VALUE.. :-/
  };

  handleChange_role = selectedOption_role => {
    this.setState({ selectedOption_role,error_role:false });
    console.log(`Option selected:`, selectedOption_role);
  };
//  componentWillMount(){
//    console.log(this.props.params);
//  }

   handleClickShowPassword = () => {
    //this.setState( {showPassword:!(this.showPassword) });
if(this.state.showPassword)
{
  this.setState({showPassword:false});
}
else{
  this.setState({showPassword:true});

}
  };

   handleMouseDownPassword = event => {
    event.preventDefault();
  };

  handleUsernameChange = ( newValue) => {
  this.setState({
    username:newValue,
    error_username:false,
  });
  console.log("usr"+ this.state.username)
  };


  handleLoginIDChange = ( newValue) => {
    this.setState({
      loginID:newValue,
      error_loginID:false,
    });
  }
  handlePasswordChange = ( newValue) => {
    // reset errors and validation as well
    this.setState({
      password: newValue,
     error_pass:false,
     });
    }

  handleEmailIDChange = ( newValue) => {
    // reset errors and validation as well
    this.setState({
      emailID: newValue,
      error_email:false,

     });

  };

  render(){
//    console.log("dataX"+dataX);
    const { selectedOption,selectedOption_role } = this.state;
    const {value, error, successValidation} = this.state;
    const underlineStyle = successValidation ? { borderColor: 'green' } : null;

//    this.handleUsernameChange(dataX.username)


    return (
      <React.Fragment>
        <PageTitle title="Update User Details"/>
        <Paper elevation={3} style={{width:'1000px',margin:'100px'}}>
        <div>
        <Box display="flex" flexDirection="row" p={1} m={1} >
        <Box p={1} m={1} style={{marginTop:"40px"}}>
        <Typography variant="h4" color='textSecondary'  >
          Username
          </Typography>
        </Box>
        <Box p={1} style={{marginTop:"30px"}}>
        <TextField
           id="outlined-textarea"
           label={this.state.error_username?"Enter username":''}
           helperText={this.state.error_username ? 'Required* ' : ''}
           error={this.state.error_username}
           onChange={ e => this.handleUsernameChange(e.target.value) }
            value={this.state.username}
           style={{marginLeft:'130px',width:'300px',display:'flex'}}
           placeholder="Enter User Name"
           multiline
           variant="outlined"
           InputProps={{
            endAdornment: (
              <InputAdornment position="end">
              {this.state.error_username?  <ErrorIcon style={{color:"red"}} />:''}
              </InputAdornment>
            ),
          }}/>
        </Box>
        </Box>
        {/*
        <Box display="flex" flexDirection="row" p={1} m={1}>
        <Box p={1} m={1} >
        <Typography variant="h4" color='textSecondary'  >
          Password
          </Typography>
        </Box>

        <Box p={1} >


<FormControl  className={clsx(useStyles.margin, useStyles.textField)} variant="outlined" style={{marginLeft:'135px',width:'300px',display:'flex',}}>

          {this.state.error_pass?<InputLabel style={{ backgroundColor:"white",color:"red",}}>Enter Password</InputLabel>:''}


          <OutlinedInput
            type={this.state.showPassword ? 'text' : 'password'}
            value={this.state.password}
            placeholder="Enter password"
         error={this.state.error_pass}
            onChange={e => this.handlePasswordChange(e.target.value)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={this.handleClickShowPassword}
                  onMouseDown={this.handleMouseDownPassword}
                  edge="end"
                >
                  {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            }
          />
          {this.state.error_pass?<FormHelperText style={{color:"red"}}>
        Required*</FormHelperText>:''}
        </FormControl>

        </Box>

        </Box>
        */

            //put change password in next page

        }
        <Box display="flex" flexDirection="row" p={1} m={1}>
        <Box p={1} m={1}>
        <Typography variant="h4" color='textSecondary'  >
          Gender
          </Typography>
        </Box>


        <Box p={1} style={{marginLeft:'160px',width:'300px',display:'flex'}}>
        <div style={{width: '360px'}}>

        <Select  style={{color:"red"}}

        value={options.filter(option => option.label === this.state.selectedOption)}
        onChange={this.handleChange}
        options={options}

      />
      {this.state.error_gender?<FormHelperText style={{color:"red",marginLeft:"13px"}}> Required*</FormHelperText>:''}
      </div>
        </Box>
        </Box>

        <Box display="flex" flexDirection="row" p={1} m={1}>
        <Box p={1} m={1}>
        <Typography variant="h4" color='textSecondary'  >
          Phone
          </Typography>
        </Box>
        <Box p={1} >
        <TextField
        helperText={error ? 'Required* ' : ''}
        name="test"
        value={this.state.phone}
        error={this.state.error||this.state.error_input}
        variant="outlined"
        placeholder="Enter phone"
        label={error||this.state.error_input? "Enter 10 digit phone number":''}
        onChange={ e => this.handleInputChange(e.target.value) }
        style={{marginLeft:'170px',width:'300px',display:'flex'}}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
            {this.state.error_input||error?  <ErrorIcon style={{color:"red"}} />:''}
            </InputAdornment>
          ),
        }}


        />
        </Box>
        </Box>

        <Box display="flex" flexDirection="row" p={1} m={1}>
        <Box p={1} m={1}>
        <Typography variant="h4" color='textSecondary'  >
        Email
          </Typography>
        </Box>

        <Box p={1} >
        <TextField

          id="outlined-textarea"

          style={{marginLeft:'180px',width:'300px',display:'flex'}}
          placeholder="Enter Email ID"
          multiline
          variant="outlined"
        error={this.state.error_email}
        value={this.state.emailID}
        label={this.state.error_email?"Enter valid Email ID":''}
        helperText={this.state.error_email?"Required*":''}


           onChange={e =>{this.handleEmailIDChange(e.target.value);this.handleLoginIDChange(e.target.value)}}

          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
              {this.state.error_email?  <ErrorIcon style={{color:"red"}} />:''}
              </InputAdornment>
            ),
          }}

        />

        </Box>

        </Box>

        <Box display="flex" flexDirection="row" p={1} m={1}>
        <Box p={1} m={1}>
        <Typography variant="h4" color='textSecondary'  >
          DOB
        </Typography>

        </Box>

        <Box p={1} style={{marginLeft:'190px',width:'300px',display:'flex'}}>
        <div style={{width:'500px',marginTop:"10px"}}>
        <DatePicker
          onChange={this.onChange}
          value={this.state.date}
          format="yyyy-MM-dd"

        />

    {this.state.date==null?<FormHelperText style={{color:"red",marginLeft:"13px"}}> Required*</FormHelperText>:''}

        </div>

        </Box>
        </Box>
        <Box display="flex" flexDirection="row" p={1} m={1}>
        <Box p={1} m={1} >
        <Typography variant="h4" color='textSecondary'  >
          Login ID
          </Typography>
        </Box>

        <Box p={1} >
        <TextField
            disabled
          id="outlined-textarea"
//          label={this.state.error_loginID ? "Enter Login ID" : '' }

          value={this.state.loginID}
          style={{marginLeft:'150px',width:'300px',display:'flex'}}
          placeholder="Login ID"
          multiline
          variant="outlined"
        />
        </Box>

        </Box>
        <Box display="flex" flexDirection="row" p={1} m={1}>
        <Box p={1} m={1}>
        <Typography variant="h4" color='textSecondary'  >
          Role
          </Typography>
        </Box>


        <Box p={1} style={{marginLeft:'190px',width:'300px',display:'flex'}}>
        <div style={{width: '360px'}}>
        <Select
        value={options_role.filter(option => option.label === this.state.selectedOption_role)}
        onChange={this.handleChange_role}
        options={options_role}

      />
      {this.state.error_role?<FormHelperText style={{color:"red",marginLeft:"13px"}}> Required*</FormHelperText>:''}

      </div>
      </Box>
        </Box>


        <Box display="flex" flexDirection="row" p={1} m={1}>
        <Box p={1} m={1}>
        <Typography variant="h4" color='textSecondary'  >
          Status
          </Typography>
        </Box>

        <Box p={1} m={1}>
        <FormControl component="fieldset" className={useStyles.formControl} >
        <RadioGroup  value={this.state.status}>
          <FormControlLabel style={{marginTop:"-10px",marginLeft:"155px"}} value={userStatus.active} control={<Radio color="primary" onChange={e => this.handleStatusChange(e.target.value)}/>} label="Active" />
          <FormControlLabel style={{marginTop:"-10px"}} value={userStatus.inactive} control={<Radio color="primary" onChange={e => this.handleStatusChange(e.target.value)}/>} label="Inactive" />
        </RadioGroup>
      </FormControl>

        </Box>

        </Box>


        { this.state.status == userStatus.inactive ? null : (
        <Box display="flex" flexDirection="row" p={1} m={1}>
        <Box p={1} m={1}>
        <Typography variant="h4" color='textSecondary'  >
          Approval
          </Typography>
        </Box>

        <Box p={1} m={1}>
        <FormControl component="fieldset" className={useStyles.formControl} >
        <RadioGroup  value={this.state.approval}>
          <FormControlLabel style={{marginTop:"-10px",marginLeft:"128px"}} value={userStatus.approved} control={<Radio color="primary" onChange={e => this.handleApprovalChange(e.target.value)}/>} label="Approved" />
          <FormControlLabel style={{marginTop:"-10px"}} value={userStatus.active} control={<Radio color="primary" onChange={e => this.handleApprovalChange(e.target.value)}/>} label="Pending" />
        </RadioGroup>
      </FormControl>

        </Box>

        </Box>
        )}

        <Box display="flex" flexDirection="row" p={1} m={1}>
        <Box p={1} m={1}>

        <Button onClick={this.onSubmit} variant="contained" color="primary" style={{marginLeft:'290px',width:'300px',display:'flex'}}>
        Update Details
      </Button>
      <>
       <Dialog open={this.state.openAlert} onClose={this.handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Updated User Successfully!</DialogTitle>
       </Dialog>
      </>
      {this.state.onClick ? <Redirect to="/app/users" /> :null}
     </Box>
     </Box>

        </div>
        <div>
        </div>
        </Paper>
       </React.Fragment>

    );
  }
}

export default UpdateUser;
