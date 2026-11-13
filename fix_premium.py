code = open('script.js').read()
if 'selectPlan' not in code:
    code += """
let selectedPlan = 'premium';
function selectPlan(plan) {
  selectedPlan = plan;
  const prices = {free:'Continue Free', premium:'Upgrade to Premium - $4.99', vip:'Upgrade to VIP - $9.99'};
  document.getElementById('upgrade-btn').textContent = prices[plan];
  document.getElementById('plan-msg').textContent = '';
}
document.getElementById('upgrade-btn').addEventListener('click', function(){
  if (selectedPlan === 'free') {
    document.getElementById('plan-msg').textContent = 'You are on Free - 30 likes/day';
  } else {
    document.getElementById('plan-msg').textContent = 'Payment coming soon - this will use App Store / Google Play for ' + selectedPlan + ' worldwide.';
  }
});
"""
    open('script.js','w').write(code)
    print('PREMIUM LOGIC ADDED')
else:
    print('ALREADY THERE')
