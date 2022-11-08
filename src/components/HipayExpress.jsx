import { func, shape, string } from 'prop-types';
import React, { useEffect } from 'react';
import _get from 'lodash.get';
import RadioInput from '@hyva/react-checkout/components/common/Form/RadioInput';
import useCheckoutFormContext from '@hyva/react-checkout/hook/useCheckoutFormContext';
import usePaymentMethodCartContext from '@hyva/react-checkout/components/paymentMethod/hooks/usePaymentMethodCartContext';
import usePaymentMethodAppContext from '@hyva/react-checkout/components/paymentMethod/hooks/usePaymentMethodAppContext';


function HipayExpress({ method, selected, actions }) {

  const { registerPaymentAction } = useCheckoutFormContext();
  const { setPaymentMethod, selectedPaymentMethod } = usePaymentMethodCartContext();
  const { setPageLoader } = usePaymentMethodAppContext();

  const methodCode = _get(method, 'code');
  const isSelected = methodCode === selected.code;

  useEffect(async () => {
    if(isSelected){
        setPageLoader(true);
        registerPaymentAction(methodCode, () => {
          console.log('BIM');
          setPageLoader(true);
        });
        await setPaymentMethod(methodCode);
        setPageLoader(false);

    }
  }, [selected]);

  return (
    <div className="w-full">
      <div>
        <RadioInput
          label={_get(method, 'title')}
          name="paymentMethod"
          value={_get(method, 'code')}
          onChange={actions.change}
          checked={isSelected}
        />
      </div>
    </div>
  );
}

const methodShape = shape({
  title: string.isRequired,
  code: string.isRequired,
});

HipayExpress.propTypes = {
  method: methodShape.isRequired,
  selected: methodShape.isRequired,
  actions: shape({ change: func }),
};

HipayExpress.defaultProps = {
  actions: null,
};

export default HipayExpress;
