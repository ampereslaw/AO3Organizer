//taken from my own resume-project code
import { useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import SearchResults from "./SearchResults";

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
    
type Props = {
  dataList: List[];
  tagList: string[];
  searchType: string;
};

function Search({ dataList, tagList, searchType }: Props) {
  const [search, setSearch] = useState<string | null>("");
  let results: List [] = []
  if (searchType == "title") {
  results = dataList.filter((component) => {
    return component.title.includes(search || "");
  });
  }
  else if (searchType == "tags") {
    results = dataList.filter((component) => {
      return component.tags.includes(search || "");
    });
    }

  function searchList() {
    return <SearchResults results={results} dataList={dataList}/>;
  }
  return (
    <>
      <Autocomplete
        disablePortal
        options={tagList}
        sx={{ width: "6rem" }}
        onChange={(event, value) => setSearch(value)}
        renderInput={(params) => <TextField {...params} label="Tag Search" />}
      />
      <div>{searchList()}</div>
    </>
  );
}

export default Search;