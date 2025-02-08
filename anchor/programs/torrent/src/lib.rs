#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("Au1tsG1thDEY9gaGdh7CPDUbEE8J3G5ykBGQjQdD6vzt");

pub const ANCHOR_DISCRIMINATOR_SIZE: usize = 8;

#[program]
pub mod torrent {
    use super::*;

    pub fn create_agreement(
        ctx: Context<CreateAgreement>,
        rent_amount: u64,
        deposit_amount: u64,
        duration_months: u8,
        ipfs_cid: String,
    ) -> Result<()> {
        ctx.accounts.rental_agreement.set_inner(RentalAgreement {
            landlord: ctx.accounts.landlord.key(),
            tenant: ctx.accounts.tenant.key(),
            rent_amount,
            deposit_amount,
            duration_months,
            ipfs_cid,
            is_active: true,
        });

        Ok(())
    }

    pub fn update_agreement(
        ctx: Context<UpdateAgreement>,
        rent_amount: Option<u64>,
        deposit_amount: Option<u64>,
        duration_months: Option<u8>,
        ipfs_cid: Option<String>,
    ) -> Result<()> {
        let rental_agreement = &mut ctx.accounts.rental_agreement;

        if let Some(amount) = rent_amount {
            rental_agreement.rent_amount = amount;
        }
        if let Some(amount) = deposit_amount {
            rental_agreement.deposit_amount = amount;
        }
        if let Some(duration) = duration_months {
            rental_agreement.duration_months = duration;
        }
        if let Some(cid) = ipfs_cid {
            rental_agreement.ipfs_cid = cid;
        }

        Ok(())
    }

    pub fn terminate_agreement(ctx: Context<TerminateAgreement>) -> Result<()> {
        let rental_agreement = &mut ctx.accounts.rental_agreement;
        let tenant = &ctx.accounts.tenant;

        rental_agreement.is_active = false;
        let remaining_deposit = rental_agreement.deposit_amount;

        **tenant.try_borrow_mut_lamports()? += remaining_deposit;
        **rental_agreement
            .to_account_info()
            .try_borrow_mut_lamports()? -= remaining_deposit;

        Ok(())
    }
}

#[account]
#[derive(InitSpace)]
pub struct RentalAgreement {
    pub landlord: Pubkey,
    pub tenant: Pubkey,
    pub rent_amount: u64,
    pub deposit_amount: u64,
    pub duration_months: u8,
    #[max_len(50)]
    pub ipfs_cid: String,
    pub is_active: bool,
}

#[derive(Accounts)]
pub struct CreateAgreement<'info> {
    #[account(init, payer = landlord, space = ANCHOR_DISCRIMINATOR_SIZE + RentalAgreement::INIT_SPACE)]
    pub rental_agreement: Account<'info, RentalAgreement>,
    #[account(mut)]
    pub landlord: Signer<'info>,
    #[account(mut)]
    pub tenant: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateAgreement<'info> {
    #[account(mut, has_one = landlord)]
    pub rental_agreement: Account<'info, RentalAgreement>,
    #[account(mut)]
    pub landlord: Signer<'info>,
    #[account(mut)]
    pub tenant: Signer<'info>,
}

#[derive(Accounts)]
pub struct TerminateAgreement<'info> {
    #[account(mut, has_one = landlord)]
    pub rental_agreement: Account<'info, RentalAgreement>,
    #[account(mut)]
    pub landlord: Signer<'info>,
    #[account(mut)]
    pub tenant: Signer<'info>,
    pub system_program: Program<'info, System>,
}
