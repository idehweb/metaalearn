import React, {useState} from 'react';
import {withTranslation} from 'react-i18next';
import {Button, Col, Container, Row} from 'shards-react';
// import LoadingComponent from '#c/components/components-overview/LoadingComponent';
import {searchFlights} from '#c/functions/index';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import BarChartIcon from '@mui/icons-material/BarChart';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import HelpIcon from '@mui/icons-material/Help';
import store from '#c/functions/store';

const Thegameprofile = (props) => {
  const [fromState, setfromState] = useState();
  let st = store.getState().store.user;
  let userDetails = {}
  if (st.firstName && st.lastName) {
    userDetails.name = st.firstName + ' ' + st.lastName;
  }

  const [valueDateDeparture, setValueDateDeparture] = useState(new Date());
  const [valueDateReturn, setvalueDateReturn] = useState(new Date());
  const [IATAState, setIATAState] = useState([]);

  const [query, setquery] = useState('');
  const [data, setData] = useState();

  const handleChange = (event) => {
    console.log(event.target.value);

  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <Container fluid className="main-content-container px-4 maxWidth1200 height100vh" style={{paddingTop: '0px'}}>
      <Row style={{
        flexDirection: "column"
      }}>
        <Col style={{textAlign: 'center'}}>

          <div className="mb-3 mx-auto">
            <AccountCircleIcon className={'humanprofile social white'}/>
            <div style={{marginTop:'20px',fontWeight:'bold',color:'#fff'}}>{userDetails.name}</div>
          </div>

        </Col>
        <Col>
          <Row>
            <Col className={'game-icon-wrapper'}>
              <Button className={'game-icon'}>
                <BarChartIcon/>
                <div>آمار</div>
              </Button>
            </Col>
            <Col className={'game-icon-wrapper'}>
              <Button className={'game-icon'}>
                <WorkspacePremiumIcon/>
                <div>لیگ</div>
              </Button>
            </Col>
            <Col className={'game-icon-wrapper'}>
              <Button className={'game-icon'}>
                <HelpIcon/>
                <div>راهنما</div>
              </Button>
            </Col>
          </Row>
        </Col>

        <Col style={{margin: "30px 0 0"}}>
          <Row>

            <Col className={'game-icon-wrapper'}>
              <Button className={'game-icon-button'} onClick={(e)=>{console.log('e',e)}}>
                <div>بازی با حریف تصادفی</div>
              </Button>
            </Col>
            <Col className={'game-icon-wrapper'}>
              <Button className={'game-icon-button-dark'}>بازی با دوستان
                <span>(بزودی)</span>
              </Button>

            </Col>
          </Row>
        </Col>

      </Row>
    </Container>
  );
};

export default withTranslation()(Thegameprofile);
