
export default function loadJSON(jsonFile,setData) {
// data.json
    // const [data, setData] = useState([]);

    fetch(jsonFile
    ,{
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }
    }
    )
      .then(function(res){
        // console.log(res)
        return res.json();
      })
      .then(function(myJson) {
        // console.log(myJson);
        setData(myJson)
      });
  }