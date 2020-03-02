import React from 'react';
import { useIntl, Link } from 'umi';
import Exception from '@/components/Exception';

const intl = useIntl();

const Exception403 = () => (
  <Exception
    type="403"
    desc={intl.formatMessage({ id: 'app.exception.description.403' })}
    linkElement={Link}
    backText={intl.formatMessage({ id: 'app.exception.back' })}
  />
);

export default Exception403;
