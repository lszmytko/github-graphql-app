import moment from 'moment'
import React from 'react'



interface Iprops{
    name: string;
    createdAt: string;
    owner: {
        login: string,
        avatarUrl: string   
    };
    reference?: (node: any) => void;
}
const Repo = ({name, createdAt, owner : {login, avatarUrl}, reference}: Iprops) => {
    return (
        <div className="Repo" ref={reference}>
            <img src={avatarUrl} alt="avatar"/>
            <p>{name}</p>
            <p>{moment(createdAt).format('D MMMM YYYY')}</p>
            <p>{login}</p>  
        </div>
    )

    return <div></div>
}

export default Repo
