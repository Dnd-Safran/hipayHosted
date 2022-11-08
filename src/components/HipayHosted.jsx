import { func, shape, string } from 'prop-types';
import React, { useEffect } from 'react';
import _get from 'lodash.get';
import RadioInput from '@hyva/react-checkout/components/common/Form/RadioInput';
import useCheckoutFormContext from '@hyva/react-checkout/hook/useCheckoutFormContext';
import usePaymentMethodCartContext from '@hyva/react-checkout/components/paymentMethod/hooks/usePaymentMethodCartContext';
import usePaymentMethodAppContext from '@hyva/react-checkout/components/paymentMethod/hooks/usePaymentMethodAppContext';


function HipayHosted({ method, selected, actions }) {

  const { registerPaymentAction } = useCheckoutFormContext();
  const { setPaymentMethod, selectedPaymentMethod } = usePaymentMethodCartContext();
  const { setPageLoader } = usePaymentMethodAppContext();

  const methodCode = _get(method, 'code');
  const isSelected = methodCode === selected.code;


  const [apiURL, setApiURL]= useState(null);

  useEffect( async () => {
    if(apiURL && isSelected){
        setPageLoader(true);

        await setPaymentMethod(methodCode);

        setPageLoader(false);
    }
  },[apiURL, isSelected])

  useEffect(async () => {
    if(isSelected){
        setPageLoader(true);

        // add action
        registerPaymentAction(methodCode, () => {
            window.location = apiURL;
        });
        
        // build hipay url
        const url = '"https://stage-secure-gateway.hipay-tpp.com/payment/web/pay/df4d20da-7b6f-4fed-8603-c4ed3dca48';
        
        setApiURL(apiURL); // trigger the other useEffect

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

HipayHosted.propTypes = {
  method: methodShape.isRequired,
  selected: methodShape.isRequired,
  actions: shape({ change: func }),
};

HipayHosted.defaultProps = {
  actions: null,
};

export default HipayHosted;
