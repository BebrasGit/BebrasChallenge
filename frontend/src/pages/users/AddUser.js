//import 'date-fns';
import React, { Component } from 'react';
import PageTitle from "../../components/PageTitle/PageTitle";
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import validator from 'validator';
import ErrorIcon from '@material-ui/icons/Error';
import { Redirect} from 'react-router-dom'

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

import {useUserState } from "../../context/UserContext";

import axios from 'axios'

const Admin = 1;

const userStatus = { active : "00", approved : "01" , inactive : "02"};

const options = [
  { value: 'M', label: 'Male' },
  { value: 'F', label: 'Female' },
  { value: 'Other', label: 'Other' },
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
}))

//function FetchData(props){
//
//        var userName = useUserState();
//        return userName.name;
//}
//            "userID" :{
//                "loginID":"jk@bts.com",
//                "username":"J J",
//                "email" : "jk@bts.com",
//                "phone" : "874563210",
//                "password":"JJ@1",
//                "birthdate":"1997-09-01",
//                "gender":"M",
//                "is_active":"1"
//            },
//            "roleID":{
//                "roleName":"Admin"
//            }

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

var options_role = [];
class AddUser extends Component<NameProps> {


    constructor(props)
    {
        super(props)
        this.state = {
            selectedOption: "",
            selectedOption_role: "",
            phone:"",
            userRoleID:"",
            userID:"",
            date: new Date(),
            error: false,
            error_input:false,
            successValidation: false,
            approval:'approved',
            username:"",
            loginID:"",
            password:'',
            emailID: "",
            status:'active',
            showPassword: false,
            onClick:false,
            openAlert:false,
            error_pass:false,
           error_username:false,
           error_loginID:false,
           error_email:false,
           error_role:false,
           error_gender:false,
           created_by:this.props.name,
           modified_by:this.props.name,
           is_active: parseInt('01',8),
           userName: localStorage.getItem("username"),
           rolelist : []
        };
    }
    async componentDidMount() {
        try{
        let gresult = await axios.get(
        'http://localhost:8000/rolelist/', {
//            params : {userID : dataX.userID},
            headers: {Authorization: 'Token '+localStorage.getItem('id_token')}
        }
        );
        console.log(gresult);

        this.setState({rolelist:gresult.data})

           console.log(this.state.rolelist)


    for(let i=0;i<this.state.rolelist.length;i++)
    {
        let x =this.state.rolelist[i].roleName;
        console.log("x" + x + " type " + typeof(x))
        options_role.push({"value": x , "label": x })
    }
    console.log('options_role' + options_role)


        }catch(error){ console.log(error); }}


    async fetchData()
    {
        const data = [this.state.loginID,this.state.username,this.state.emailID,this.state.phone,this.state.password,
        ""+this.state.date.getFullYear()+"-"+(this.state.date.getMonth()+1)+"-"+this.state.date.getDate(),this.state.selectedOption.value,
        this.state.is_active,this.state.selectedOption_role.value];
//        console.log("active" + userStatus['active'])
        try{
        let gresult = await axios.post(
        'http://localhost:8000/api/insert/', {
            "userID" :{
                "loginID":data[0],
                "username":data[1],
                "email":data[2],
                "phone":data[3],
                "password":data[4],
                "birthdate":data[5].toString(),
                "gender":data[6],
                "created_by" : this.state.userName,
                "modified_by" : this.state.userName,
                "is_active" : userStatus.approved
            },
            "roleID":{
                "roleName":data[8]
            }
        },{
            headers: {
                'Content-Type' : 'application/json',
                Authorization: 'Token '+localStorage.getItem('id_token')
            }
        }
        );
//        console.log(data[5].stringify());

        }catch(error){ console.log(error); }
    }

  printdate(){
    console.log(this.state.date);
  }

  alertAndRedirect(){
     setTimeout(() => {this.setState({openAlert:true});},1000);
        setTimeout(() => {
            this.setState({openAlert:false, onClick:true});
        },3000);
  }

  onChange = date => {
    console.log("date"+date);
  this.setState({ date })}
  
  handleClickOpen = () => {
    this.setState({openAlert:true});
  };

  handleClose = () => {
    this.setState({openAlert:false});
  };

  isValid = () => {
    const {phone} = this.state;
  
    return validator.isMobilePhone(phone,"en-IN")  ;
  
  }
  handleInputChange = ( newValue) => {
    // reset errors and validation as well
    this.setState({
      phone: newValue,
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
      if(this.state.password=='')
      {
    this.setState({error_pass:true})
      }

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

      if(this.state.selectedOption_role=="")
      {
        this.setState({error_role:true});
      }
      if(this.state.selectedOption==null)
      {
        this.setState({error_gender:true});

      }

    if(this.state.error == false && this.state.error_email== false &&
    this.state.error_gender == false && this.state.error_loginID == false &&
    this.state.error_role==false && this.state.error_username == false && this.state.error_pass==false)
    {
        this.fetchData();
        this.alertAndRedirect();
    }

  }

  handleChange = selectedOption => {
    this.setState({ selectedOption,error_gender:false });
    console.log(`Option selected:`, selectedOption.value);
  };

  handleChange_role = selectedOption_role => {
    this.setState({ selectedOption_role,error_role:false });
    console.log(`Option selected:`, selectedOption_role.value);
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

    const { selectedOption,selectedOption_role } = this.state;
    const {value, error, successValidation} = this.state;
    const underlineStyle = successValidation ? { borderColor: 'green' } : null;

    const loadOptions = (inputValue, callback) => {
        callback(inputValue);
    };


//    = [
//      { value: 'Admin', label: 'Admin' }
//      ];

    return (

      <React.Fragment>
        <PageTitle title="Add New User"/>  
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
        <Box display="flex" flexDirection="row" p={1} m={1}>
        <Box p={1} m={1}>
        <Typography variant="h4" color='textSecondary'  >
          Gender 
          </Typography>
        </Box>  
        

        <Box p={1} style={{marginLeft:'160px',width:'300px',display:'flex'}}>
        <div style={{width: '360px'}}>
        
        <Select  style={{color:"red"}}
        
        value={selectedOption}
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
//          error={this.state.error_loginID}
//          onChange={ e => this.handleLoginIDChange(e.target.value) }
          style={{marginLeft:'150px',width:'300px',display:'flex'}}
          placeholder="Login ID"
//          multiline
          variant="outlined"
//          helperText={this.state.error_loginID ? 'Required* ' : ''}
           value={this.state.loginID}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
              {this.state.error_loginID?  <ErrorIcon style={{color:"red"}} />:''}
              </InputAdornment>
            ),
          }}/>
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
        value={selectedOption_role}
        onChange={this.handleChange_role}
        options={options_role}

      />
      {this.state.error_role?<FormHelperText style={{color:"red",marginLeft:"13px"}}> Required*</FormHelperText>:''}      
      
      </div>
      </Box>
        </Box>
        <Box display="flex" flexDirection="row" p={1} m={1}>
        <Box p={1} m={1}>
        
        <Button onClick={this.onSubmit} variant="contained" color="primary" style={{marginLeft:'290px',width:'300px',display:'flex'}}>
        Add New User
      </Button>
      <>
       <Dialog open={this.state.openAlert} onClose={this.handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Added User Successfully!</DialogTitle>
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

export default AddUser;
