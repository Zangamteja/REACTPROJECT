/* eslint-disable react/function-component-definition */
import React from 'react';
import { Avatar } from 'rsuite';
import { getNameInitials } from '../misc/helpers';

const ProfileAvatar = ({ name, ...avatarProps }) => {
  return (
    <Avatar circle {...avatarProps}>
      {getNameInitials(name)}
    </Avatar>
  );
};

export default ProfileAvatar;
