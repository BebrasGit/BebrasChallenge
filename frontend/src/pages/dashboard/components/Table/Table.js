import React, {useState, useEffect} from "react";
import {
  Table,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@material-ui/core";
import axios from 'axios';
// components
import { Button } from "../../../../components/Wrappers";

const states = {
  sent: "success",
  pending: "warning",
  declined: "secondary",
};

export default function TableComponent({ data }) {


//  var header = headers.map(i => i.toUpperCase());
//  header.shift(); // delete "id" key
  var headerss = ["userid","username","email","phone","role" , "created on","created by","status","approval"];

  console.log(headerss);
  console.log(data);

  return (
    <Table className="mb-0">
      <TableHead>
        <TableRow>
          {headerss.map(key => (
            <TableCell key={key}>{key}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map(({ userID, username, loginID }) => (
          <TableRow key={userID}>
            <TableCell className="pl-3 fw-normal">{username}</TableCell>
            <TableCell>{loginID}</TableCell>
            {/*<TableCell>
              <Button
                color={states[status.toLowerCase()]}
                size="small"
                className="px-2"
                variant="contained"
              >
                {status}
              </Button>
            </TableCell>*/}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
