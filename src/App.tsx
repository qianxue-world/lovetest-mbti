import { useState } from 'react';
import { StartScreen } from './components/StartScreen';
import { QuestionScreen } from './components/QuestionScreen';
import { ResultScreen } from './components/ResultScreen';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { PaymentModal } from './components/PaymentModal';
import { PaymentMethodModal } from './components/PaymentMethodModal';
import { Answers, PersonalityType, Trait } from './types';
import './App.css';

type Screen = 'start' | 'question' | 'result';

function App() {
  const [screen, setScreen] = useState<Screen>('start');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answers>({
    E: 0, I: 0, N: 0, S: 0, T: 0, F: 0, J: 0, P: 0
  });
  const [personalityType, setPersonalityType] = useState<PersonalityType>('INFP');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showMethodModal, setShowMethodModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{ plan: 'basic' | 'professional' | 'premium'; price: string } | null>(null);

  const totalQuestions = 8;

  const handleStart = () => {
    setScreen('question');
  };

  const handleAnswer = (trait: Trait) => {
    const newAnswers = { ...answers, [trait]: answers[trait] + 1 };
    setAnswers(newAnswers);

    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const type = calculatePersonalityType(newAnswers);
      setPersonalityType(type);
      setShowPaymentModal(true);
    }
  };

  const handleSelectPlan = (plan: 'basic' | 'professional' | 'premium') => {
    const prices = {
      basic: '0.1',
      professional: '19.9',
      premium: '199'
    };
    setSelectedPlan({ plan, price: prices[plan] });
    setShowMethodModal(true);
  };

  const handleSelectMethod = (method: 'wechat' | 'alipay') => {
    if (!selectedPlan) return;
    
    // TODO: 在这里接入支付API
    // 根据 method 和 selectedPlan 调用相应的支付接口
    console.log('Payment method:', method);
    console.log('Plan:', selectedPlan.plan);
    console.log('Price:', selectedPlan.price);
    
    // 示例：调用支付接口
    initiatePayment(method, selectedPlan.plan, selectedPlan.price);
  };

  const initiatePayment = async (method: 'wechat' | 'alipay', plan: string, price: string) => {
    // ============================================
    // 在这里配置您的收款账号信息
    // ============================================
    
    const paymentConfig = {
      // 微信支付配置
      wechat: {
        merchantId: 'YOUR_WECHAT_MERCHANT_ID',  // 您的微信商户号
        appId: 'YOUR_WECHAT_APP_ID',            // 您的微信AppID
        apiKey: 'YOUR_WECHAT_API_KEY',          // 您的微信API密钥
      },
      // 支付宝配置
      alipay: {
        appId: 'YOUR_ALIPAY_APP_ID',            // 您的支付宝AppID
        privateKey: 'YOUR_ALIPAY_PRIVATE_KEY',  // 您的支付宝私钥
        publicKey: 'YOUR_ALIPAY_PUBLIC_KEY',    // 支付宝公钥
      }
    };

    // 构建订单信息
    const orderInfo = {
      orderId: `ORDER_${Date.now()}`,
      plan: plan,
      amount: price,
      timestamp: new Date().toISOString(),
      description: `MBTI性格测试 - ${plan}版`
    };

    console.log('Payment Config:', paymentConfig[method]);
    console.log('Order Info:', orderInfo);

    try {
      // TODO: 调用实际的支付API
      // 示例代码（需要根据实际支付SDK调整）:
      /*
      let paymentResult;
      
      if (method === 'wechat') {
        // 微信支付
        paymentResult = await WeChatPay.createOrder({
          merchantId: paymentConfig.wechat.merchantId,
          appId: paymentConfig.wechat.appId,
          orderId: orderInfo.orderId,
          amount: orderInfo.amount,
          description: orderInfo.description,
          notifyUrl: 'https://your-domain.com/api/payment/notify',
          returnUrl: 'https://your-domain.com/payment/success'
        });
        
        // 显示支付二维码或跳转支付页面
        // 等待支付结果回调
        const paymentStatus = await checkPaymentStatus(orderInfo.orderId);
        
        if (paymentStatus === 'success') {
          handlePaymentSuccess();
        } else {
          handlePaymentFailure('支付失败，请重试');
        }
        
      } else {
        // 支付宝支付
        paymentResult = await Alipay.createOrder({
          appId: paymentConfig.alipay.appId,
          orderId: orderInfo.orderId,
          amount: orderInfo.amount,
          subject: orderInfo.description,
          notifyUrl: 'https://your-domain.com/api/payment/notify',
          returnUrl: 'https://your-domain.com/payment/success'
        });
        
        // 跳转到支付页面
        // 等待支付结果回调
        const paymentStatus = await checkPaymentStatus(orderInfo.orderId);
        
        if (paymentStatus === 'success') {
          handlePaymentSuccess();
        } else {
          handlePaymentFailure('支付失败，请重试');
        }
      }
      */

      // ============================================
      // 临时：模拟支付流程（开发测试用）
      // 实际使用时请删除此部分，使用上面的真实支付API
      // ============================================
      const userConfirm = window.confirm(
        `支付方式: ${method === 'wechat' ? '微信支付' : '支付宝'}\n套餐: ${plan}\n金额: ¥${price}\n\n点击"确定"模拟支付成功\n点击"取消"模拟支付失败\n\n请在 src/App.tsx 的 initiatePayment 函数中配置您的收款账号`
      );

      if (userConfirm) {
        // 模拟支付成功
        handlePaymentSuccess();
      } else {
        // 模拟支付失败
        handlePaymentFailure('支付已取消');
      }

    } catch (error) {
      console.error('Payment error:', error);
      handlePaymentFailure('支付过程中出现错误，请重试');
    }
  };

  const handlePaymentSuccess = () => {
    // 支付成功，关闭所有弹窗，跳转到结果页面
    setShowMethodModal(false);
    setShowPaymentModal(false);
    setScreen('result');
  };

  const handlePaymentFailure = (errorMessage: string) => {
    // 支付失败，保持在支付弹窗，显示错误信息
    alert(errorMessage);
    // 不关闭任何弹窗，让用户可以重新尝试
  };

  const handleCloseMethodModal = () => {
    setShowMethodModal(false);
    // 不关闭套餐选择弹窗，让用户可以重新选择
  };

  const calculatePersonalityType = (ans: Answers): PersonalityType => {
    let type = '';
    type += ans.E > ans.I ? 'E' : 'I';
    type += ans.N > ans.S ? 'N' : 'S';
    type += ans.T > ans.F ? 'T' : 'F';
    type += ans.J > ans.P ? 'J' : 'P';
    return type as PersonalityType;
  };

  const handleRestart = () => {
    setScreen('start');
    setCurrentQuestion(0);
    setAnswers({ E: 0, I: 0, N: 0, S: 0, T: 0, F: 0, J: 0, P: 0 });
  };

  // Dynamic color themes for each question - Red to Purple spectrum
  const colorThemes = [
    'linear-gradient(135deg, #FFD93D 0%, #FF6B9D 50%, #C8A2FF 100%)', // Yellow → Pink → Purple
    'linear-gradient(135deg, #FF6B9D 0%, #FF8BA7 50%, #FFB6C1 100%)', // Pink → Light Pink → Pastel Pink
    'linear-gradient(135deg, #C8A2FF 0%, #B47AEA 50%, #9D5BD2 100%)', // Light Purple → Medium Purple → Deep Purple
    'linear-gradient(135deg, #FF4757 0%, #FF6B9D 50%, #C8A2FF 100%)', // Red → Pink → Purple
    'linear-gradient(135deg, #FFD93D 0%, #FFA07A 50%, #FF6B9D 100%)', // Yellow → Coral → Pink
    'linear-gradient(135deg, #FF8BA7 0%, #C8A2FF 50%, #9D5BD2 100%)', // Light Pink → Purple → Deep Purple
    'linear-gradient(135deg, #FF6B9D 0%, #E056FD 50%, #C8A2FF 100%)', // Pink → Magenta → Purple
    'linear-gradient(135deg, #FFA07A 0%, #FF6B9D 50%, #B47AEA 100%)', // Coral → Pink → Purple
  ];

  const getBackgroundStyle = () => {
    if (screen === 'question') {
      return { background: colorThemes[currentQuestion] };
    }
    return { background: colorThemes[0] };
  };

  return (
    <div className="app" style={getBackgroundStyle()}>
      <LanguageSwitcher />
      <div className="container">
        {screen === 'start' && <StartScreen onStart={handleStart} />}
        {screen === 'question' && (
          <QuestionScreen
            currentQuestion={currentQuestion}
            totalQuestions={totalQuestions}
            onAnswer={handleAnswer}
          />
        )}
        {screen === 'result' && (
          <ResultScreen
            personalityType={personalityType}
            onRestart={handleRestart}
          />
        )}
        <div className="card-watermark">@潜学天下</div>
      </div>
      {showPaymentModal && <PaymentModal onSelectPlan={handleSelectPlan} />}
      {showMethodModal && selectedPlan && (
        <PaymentMethodModal
          plan={selectedPlan.plan}
          price={selectedPlan.price}
          onSelectMethod={handleSelectMethod}
          onClose={handleCloseMethodModal}
        />
      )}
    </div>
  );
}

export default App;
