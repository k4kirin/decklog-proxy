import React, {useState} from 'react';
import './App.css';


function Searchbar(){
    const [lang, setLang] = useState("jp");
    const [code, setCode] = useState("");
    const [list, setList] = useState([]);
    const [game_title_id, set_game_title_id] = useState(1);
    const [toPop, setToPop] = useState(-1);
    const [loading, setLoading] = useState(false);

    const clickBgHandler = (e) => {
        setToPop(-1);
    }

    function Card(url, index){
        const clickCardHandler = (e) => {
            index = parseInt(e.target.id)

            if(toPop !== index) {
                setToPop(index);
            } else {
                setList(deleteArr(list, index));
                setToPop(-1);
            }
        }

        let img = new Image();
        img.src = url;

        let width, height;
        if(game_title_id === 1){
            width = "5.9cm";
            height = "8.6cm";
        } else {
            width = "6.3cm";
            height = "8.8cm";
        }

        let isHorizontal = img.height < img.width;

        const imgStyle = isHorizontal ? {/*transform: 'rotate(90deg) translate(-1.25cm, 1.25cm)',*/ width: height, height: width, } : {width: width, height: height};
        // const imgStyle = {width: width, height: height};
        const divStyle = {
            width: width, height: height,
            // display: 'inline-block',
            float: 'left',
            position: 'relative',};

        return (
            <div class={index === toPop ? "card pop" : "card notpop"} onClick={clickCardHandler} id={index} style={divStyle}><img src ={url} class="proxies-card clip" alt={url} style={imgStyle}/></div>
        )
    }

    const deleteArr = (a, i) => {
        let copy = a;
        copy.splice(i, 1);
        return copy;
    }

    const changeLangHandler = (e) => {
        setLang(e.target.value);
    }

    const changeCodeHandler = (e) => {
        e.preventDefault();
        setCode(e.target.value);
    }

    const constructCardUrl = (e, i) => {
        const prefix = "https://";
        const urls = {
            1: "cf-vanguard.com/wordpress/wp-content/images/cardlist/",
            2: "ws-tcg.com/wordpress/wp-content/images/cardlist/",
            3: "fc-buddyfight.com/wordpress/wp-content/images/card/",
            5: "rebirth-fy.com/wordpress/wp-content/images/cardlist/",
            6: "shadowverse-evolve.com/wordpress/wp-content/images/cardlist/",
            7: "ws-blau.com/wordpress/wp-content/images/cardlist/",
        }
        const midfix =  lang==="en" ? "en." : "";
        return prefix+midfix+urls[i]+e;
    }

    const submitHandler = () => {
        setToPop(-1);
        setLoading(true);
        fetch("https://decklog-proxy-server.k4kirin.repl.co/api/decklist?id="+code+"&lang="+lang,{
            method: "GET"
        }).then((res) => res.json())
            .then((res) => {
                set_game_title_id(res["game_title_id"]);
                setList(res["list"].map(x => Array(x["num"]).fill(constructCardUrl(x["img"], res["game_title_id"]))).flat());
            }).finally(() => setLoading(false))
            .catch((error) => {console.log(error)})
    }


    return (
        <div>
        <div class={"dont-print"} onClick={clickBgHandler}>
            <div onChange={changeLangHandler}>
                Language:
                <label><input type="radio" name="lang" value="jp" defaultChecked="checked"/>JP</label>
                <label><input type="radio" name="lang" value="en"/>EN</label>
            </div>
            <div>
                Deck Code:
                <input type="text"  onChange={changeCodeHandler}/>
            </div>
            <div>
                <button onClick={submitHandler}>Submit</button>
            </div>
        </div>
        <div className="printArea">
            {loading ? "Loading..." : list.map((e, i) => Card(e, i))}
        </div>
        </div>

    );

}

// class Searchbar extends React.Component{
//     render(){
//         return(<div class="searchbar">
//             <input type="radio" name="lang" value="jp"/>JP
//                 <input type="radio" name="lang" value="en"/>EN
//             <input type="text" placeholder="deck code (eg. 3xls)" pattern="[a-zA-Z0-9\s]+"/>
//             <input type="submit"/>
//         </div>);
//     }
// }

export default Searchbar