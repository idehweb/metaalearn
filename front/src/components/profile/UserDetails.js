import React from 'react';
import {Card, CardHeader,} from 'shards-react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import store from '#c/functions/store';

const UserDetails = ({
                       socialMode,
                       userDetails = {
                         name: 'john doe',
                         metaTitle: 'john doe',
                         metaValue: 'john doe',
                         jobTitle: 'business man',
                         avatar: '',
                         address: [],
                       },
                     }) => {
  let st = store.getState().store.user;
  // this.state = {
  //   phoneNumber: st.phoneNumber,
  //   firstName: st.firstName,
  //   lastName: st.lastName,
  //   email: st.email,
  //   internationalCode: st.internationalCode,
  // };
  if (st.firstName && st.lastName) {
    userDetails.name = st.firstName + ' ' + st.lastName;
  }
  if (st.phoneNumber) {
    userDetails.jobTitle = st.phoneNumber;
  }
  if (socialMode) {
    return <>
      <div className="" style={{display:'flex',gap:'20px',padding:'40px 20px 15px 20px'}}>
        <AccountCircleIcon className={'humanprofile social'}/>
        <div>
          <h4 className="mb-0">{userDetails.name}</h4>
          <div className={'followers-part'}>
            <span>۰ دنبال کننده</span>
            <span>۰ دنبال شونده</span>
          </div>
        </div>
      </div>
    </>
  }
  return (
    <Card small className="mb-5 pt-3 profile-box">
      <CardHeader className="border-bottom text-center">
        <div className="mb-3 mx-auto">
          <AccountCircleIcon className={'humanprofile'}/>
        </div>
        <h4 className="mb-0">{userDetails.name}</h4>
        <span className="text-muted d-block mb-2">{userDetails.jobTitle}</span>
        {/*<Button pill outline size="sm" className="mb-2">*/}
        {/*<i className="material-icons mr-1">person_add</i> {t('')}*/}
        {/*</Button>*/}
      </CardHeader>
    </Card>
  );
};

export default UserDetails;
