//taken from my own resume-project code
import { Box, ButtonGroup, Button } from "@mui/material";

type List = {
  title: string;
  author?: string;
  link?: string;
  date?: string;
  fandom?: string;
  rating?:string;
  warning?:string;
  tags?: string [];
  words?: number;
  chaps?: number;

};
type props = {
  results: List[];
  dataList: List[];
};

const SearchResults = ({ results, dataList }: props) => {
  const filteredResults = results.map((component) => (
    <>
    <b><a href = {component.link}>{component.title}</a></b>
    <h2>By: {component.author}</h2>
    <h3>Tags: 
      <ButtonGroup variant="contained" aria-label="outlined primary button group">
      {component.tags}.map((item, index) => (
        <Button onClick={() =>{
              results = dataList.filter((component) => {
                return component.tags.includes({item} || "");}
                forceUpdate()}}

                key={index}>{item}</Button>
      
      </ButtonGroup>
    </h3>
    </>
  ));
  return <Box>{filteredResults}</Box>;
};

export default SearchResults;