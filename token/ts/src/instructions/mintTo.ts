import { struct, u8 } from '@solana/buffer-layout';
import { u64 } from '@solana/buffer-layout-utils';
import { PublicKey, Signer, TransactionInstruction } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '../constants';
import { TokenInstruction } from './types';
import { addSigners } from './utils';

const dataLayout = struct<{
    instruction: TokenInstruction;
    amount: bigint;
}>([u8('instruction'), u64('amount')]);

/**
 * Construct a MintTo instruction
 *
 * @param mint         Public key of the mint
 * @param dest         Public key of the account to mint to
 * @param authority    The mint authority
 * @param multiSigners Signing accounts if `authority` is a multiSig
 * @param amount       Amount to mint
 * @param programId    SPL Token program account
 *
 * @return Instruction to add to a transaction
 */
export function createMintToInstruction(
    mint: PublicKey,
    dest: PublicKey,
    authority: PublicKey,
    multiSigners: Signer[],
    amount: number | bigint,
    programId = TOKEN_PROGRAM_ID
): TransactionInstruction {
    const keys = addSigners(
        [
            { pubkey: mint, isSigner: false, isWritable: true },
            { pubkey: dest, isSigner: false, isWritable: true },
        ],
        authority,
        multiSigners
    );

    const data = Buffer.alloc(dataLayout.span);
    dataLayout.encode(
        {
            instruction: TokenInstruction.MintTo,
            amount: BigInt(amount),
        },
        data
    );

    return new TransactionInstruction({ keys, programId, data });
}