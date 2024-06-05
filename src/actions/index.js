import { useRoutes } from 'react-router-dom';

// project import

import axios from "axios";
import {API_URL} from "../constants";


export const fetchBaseSchemas = async() => {
  const data =  await fetch(API_URL+"/indicator_selector/base-schemas").then((res) =>
          res.json(),
      );

  console.log("data ==>",data);
  return data;
};
