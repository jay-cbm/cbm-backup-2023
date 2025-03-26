import React from 'react';
import { PostBody } from '../_components/post-body';
import Container from '../_components/container';

const CRYPTO_MARKDOWN = `
# Ultimate Guide to Cryptocurrency Security in 2025

## Introduction to Crypto Security

Cryptocurrency security has become more critical than ever as digital assets continue to gain mainstream adoption and value. This guide covers essential security practices for both beginners and experienced crypto investors.

{{notice type="info"}}
This guide assumes you have basic knowledge of blockchain technology and cryptocurrency concepts. If you're completely new to the space, check out our [Beginner's Guide to Cryptocurrency](https://example.com/beginners-guide) first.
{{/notice}}

## The Current Crypto Security Landscape

{{image src="/images/security-landscape-2025.jpg" caption="The evolving cryptocurrency security landscape in 2025"}}

The security landscape for cryptocurrency has evolved dramatically since Bitcoin's inception. With institutional adoption and increased regulatory scrutiny, both the threats and protection mechanisms have grown in sophistication.

### Major Threats in 2025

| Threat Type | Risk Level | Prevention Difficulty |
|-------------|------------|------------------------|
| Phishing    | Very High  | Medium                 |
| SIM Swapping| High       | Medium-High            |
| Smart Contract Vulnerabilities | High | High       |
| Quantum Computing Attacks | Medium | Very High     |
| Social Engineering | Very High | Medium           |

{{notice type="warning"}}
Phishing attacks remain the #1 method hackers use to steal cryptocurrency. Always verify URLs carefully and never click suspicious links, even if they appear to come from trusted sources.
{{/notice}}

## Hardware Wallet Security

Hardware wallets remain the gold standard for securing cryptocurrency holdings in 2025.

{{notice type="tip"}}
For large holdings (over $10,000), consider using a multi-signature setup with 2-3 different hardware wallets from different manufacturers to protect against single points of failure.
{{/notice}}

### Top Hardware Wallets in 2025

1. **Ledger Quantum Shield**
   - Post-quantum cryptography support
   - Physical attack resistance
   - Multi-asset support for 5,000+ cryptocurrencies

2. **Trezor Ultra Secure**
   - Open-source firmware
   - Air-gapped signing capabilities
   - Enhanced physical tamper protection

3. **GridPlus Lattice1 Pro**
   - Built-in secure card system
   - DeFi-optimized interface
   - Institutional-grade security

## Securing Your Seed Phrase

{{notice type="error"}}
NEVER store your seed phrase digitally (no photos, no digital documents, no cloud storage, no password managers). This is the #1 security mistake that leads to total loss of funds.
{{/notice}}

### Best Practices for Seed Phrase Storage:

\`\`\`
# Seed Phrase Security Checklist
✓ Write on durable material (steel, titanium)
✓ Store in multiple secure locations
✓ Consider splitting using Shamir's Secret Sharing
✓ Test recovery process regularly
✓ Never share with anyone
\`\`\`

{{image src="/images/seed-phrase-storage.jpg" caption="Example of proper seed phrase storage using metal plates"}}

## Smart Contract Security

Participating in DeFi? Smart contract security is essential to protect your assets.

{{notice type="success"}}
Some leading DeFi protocols now offer smart contract insurance that can protect your assets in case of technical vulnerabilities. Consider allocating 2-5% of your investment to insurance coverage.
{{/notice}}

### How to Check Smart Contract Security:

1. Verify audit reports from reputable firms like OpenZeppelin, Certik, and Trail of Bits
2. Check the project's bug bounty program size (larger is better)
3. Look for formal verification of critical functions
4. Review the timelock duration for governance changes
5. Check for gradual migration patterns for upgrades

## Exchange Security

Despite the "not your keys, not your coins" mantra, many users still need to use exchanges.

### Exchange Security Checklist:

- [ ] Use exchanges with proof-of-reserves
- [ ] Enable all security features (2FA, whitelisting, etc.)
- [ ] Create a separate email for crypto exchanges only
- [ ] Use advanced password manager with breach detection
- [ ] Withdraw large amounts to self-custody

## Privacy Best Practices

{{notice type="info"}}
Remember that most blockchains are public ledgers. Your transaction history is visible to anyone who knows your addresses, which can be a security and privacy concern.
{{/notice}}

{{embed url="https://www.youtube.com/embed/9s-l_pfgmF4"}}

### Privacy-Enhancing Tools in 2025:

- **Chain-hopping protocols**: Move between different blockchains to break transaction trails
- **Zero-knowledge proofs**: Verify transactions without revealing details
- **Coin mixing services**: Pool transactions to obfuscate origins
- **Privacy-focused wallets**: Built-in privacy features for everyday use

## Protecting Against Quantum Computing

{{notice type="warning"}}
Quantum computing threats to ECDSA (used in Bitcoin and many other cryptocurrencies) are becoming more realistic. Projects without quantum resistance plans should be approached with caution for long-term holdings.
{{/notice}}

### Quantum-Resistant Projects to Watch:

| Project | Approach | Implementation Stage |
|---------|----------|----------------------|
| QRL | XMSS | Fully Implemented |
| IOTA | Winternitz OTS+ | In Progress |
| Ethereum | zkSNARKs + quantum-resistant signatures | Planned |
| Cardano | Isogenies and lattice-based cryptography | Research Phase |

## Conclusion

Security in the cryptocurrency space requires constant vigilance and adaptation to new threats and technologies.

{{notice type="tip"}}
The best security system is one that balances strong protection with usability. If your security is too complex, you might make mistakes or avoid using it altogether.
{{/notice}}

Stay safe, and remember that in crypto, you are your own bank—with all the responsibilities that entails.
`;

export default function TestMarkdownPage() {
  return (
    <Container>
      <div className="max-w-3xl mx-auto mt-10 mb-20">
        <h1 className="text-3xl font-bold mb-8">PagesCMS Markdown Component Test</h1>
        <p className="text-lg mb-5">This page demonstrates all the enhanced markdown features compatible with PagesCMS, including notice components, embedded content, and special formatting.</p>
        <div className="border rounded-lg p-6 shadow-sm bg-white">
          <PostBody content={CRYPTO_MARKDOWN} />
        </div>
      </div>
    </Container>
  );
}
