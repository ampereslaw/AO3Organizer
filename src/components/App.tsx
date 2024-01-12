import {Box, Grid, Select, InputLabel, MenuItem} from "@mui/material";
import axios from 'axios';
import Search from "./Search"
import {useState} from 'react'
import PieChart from "./PieChart"

function App() {
  type List = {
    title: string;
    author?: string;
    link?: string;
    date?: string;
    fandom?: string;
    rating?:string;
    warning?:string;
    tags: string [];
    words?: number;
    chaps?: number;

  };

  const [searchField, setSearchField] = useState("")
  const handleChange = (event: SelectChangeEvent) => {
    setSearchField(event.target.value as string);
  };

  let fics: List[] = [];
  let tags: string[] = []
  let fandomlabels: string[] = []
  let fandomdata: number[] = []
  let ratinglabels: string[] = []
  let ratingdata: number[] = []
  let taglabels: string[] = []
  let tagdata: number[] = []

  const fetchData = async () => {
    try {
        const response = await axios.get('http://localhost:5000/api/get_data');
        const tagresponse = await axios.get('http://localhost:5000/api/get_taglist');
        fics = response.data;
        tags = tagresponse.data;
    } catch (error) {
        console.log('Error');
    }
  };
  
  fetchData();

  const fetchPieData = async () => {
    try {
    const chartdata = await axios.get('http://localhost:5000/api/get_chartdata');
    fandomlabels = chartdata.data.flabels
    fandomdata = chartdata.data.fdata
    ratinglabels = chartdata.data.rlabels
    ratingdata = chartdata.data.rdata
    taglabels = chartdata.data.tlabels
    tagdata = chartdata.data.tdata
  } catch (error) {
    console.log('Error');
}
  };

  fetchPieData();

  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Box>
        <InputLabel id="demo-simple-select-label">Search By:</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={searchField}
          onChange={handleChange}
        >
          <MenuItem value="Title">Title</MenuItem>
          <MenuItem value="Tags">Tags</MenuItem>
        </Select>
        <Search searchType={searchField} tagList={tags} dataList={fics}></Search>
        </Box>
      </Grid>

      <Grid item xs={6}>
        <Box className="form">
        <form action="/add" method="POST">
            <input type="text" name="title" id="title"/>
            <input type="text" name="tags" id="tags"/>
            <input type="submit" value="Add Fic"/>
        </form>
        </Box>
      </Grid>

      <Grid item xs={12}>
        <Box>
          <h1>Fandom Breakdown</h1>
          <PieChart labels = {fandomlabels} data = {fandomdata}/>
          </Box>
        <Box>
        <h1>Rating Breakdown</h1>
        <PieChart labels = {ratinglabels} data = {ratingdata}/>
        </Box>
        <Box>
          <h1>Tag Breakdown</h1>
        <PieChart labels = {taglabels} data = {tagdata}/>
        </Box>
      </Grid>

    </Grid>
  )
}

export default App
